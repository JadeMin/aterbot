const mojangson = require('mojangson')
const vsprintf = require('sprintf-js').vsprintf

module.exports = loader

function loader (registryOrVersion) {
  const registry = typeof registryOrVersion === 'string' ? require('prismarine-registry')(registryOrVersion) : registryOrVersion
  const defaultLang = registry.language
  const { MessageBuilder } = require('./MessageBuilder')(registry)

  /**
   * ChatMessage Constructor
   * @param {String|Object|Number} message content of ChatMessage
   */
  class ChatMessage {
    constructor (message, displayWarning = false) {
      if (typeof message === 'string') {
        if (message === '') {
          this.json = { text: '' }
        } else {
          this.json = MessageBuilder.fromString(message, { colorSeparator: '§' })
        }
      } else if (typeof message === 'number') {
        this.json = { text: message }
      } else if (typeof message === 'object' && Array.isArray(message)) {
        this.json = { extra: message }
      } else if (typeof message === 'object') {
        this.json = message
      } else {
        throw new Error('Expected String or Object for Message argument')
      }
      this.parse(displayWarning)
    }

    /**
     * Parses the this.json property to decorate the properties of the ChatMessage.
     * Called by the Constructor
     * @return {void}
     */
    parse (displayWarning = false) {
      const json = this.json
      // Message scope for callback functions
      // There is EITHER, a text property or a translate property
      // If there is no translate property, there is no with property
      // HOWEVER! If there is a translate property, there may not be a with property
      if (typeof json.text === 'string' || typeof json.text === 'number') {
        this.text = json.text
      } else if (typeof json.translate === 'string') {
        this.translate = json.translate
        if (typeof json.with === 'object') {
          if (!Array.isArray(json.with)) {
            throw new Error('Expected with property to be an Array in ChatMessage')
          }
          this.with = json.with.map(entry => new ChatMessage(entry))
        }
      }
      // Parse extra property
      // Extras are appended to the initial text
      if (typeof json.extra === 'object') {
        if (!Array.isArray(json.extra)) {
          throw new Error('Expected extra property to be an Array in ChatMessage')
        }
        this.extra = json.extra.map(entry => new ChatMessage(entry))
      }
      // Text modifiers
      this.bold = json.bold
      this.italic = json.italic
      this.underlined = json.underlined
      this.strikethrough = json.strikethrough
      this.obfuscated = json.obfuscated

      // Supported constants @ 2014-04-21
      const supportedColors = [
        'black',
        'dark_blue',
        'dark_green',
        'dark_aqua',
        'dark_red',
        'dark_purple',
        'gold',
        'gray',
        'dark_gray',
        'blue',
        'green',
        'aqua',
        'red',
        'light_purple',
        'yellow',
        'white',
        'obfuscated',
        'bold',
        'strikethrough',
        'underlined',
        'italic',
        'reset'
      ]
      const supportedClick = [
        'open_url',
        'open_file',
        'run_command',
        'suggest_command'
      ]
      const supportedHover = [
        'show_text',
        'show_achievement',
        'show_item',
        'show_entity'
      ]

      // Parse color
      this.color = json.color
      switch (this.color) {
        case 'obfuscated':
          this.obfuscated = true
          this.color = null
          break
        case 'bold':
          this.bold = true
          this.color = null
          break
        case 'strikethrough':
          this.strikethrough = true
          this.color = null
          break
        case 'underlined':
          this.underlined = true
          this.color = null
          break
        case 'italic':
          this.italic = true
          this.color = null
          break
        case 'reset':
          this.reset = true
          this.color = null
          break
      }
      // Make sure color is valid
      if (Array.prototype.indexOf && this.color &&
        supportedColors.indexOf(this.color) === -1 &&
        !this.color.match(/#[a-fA-F\d]{6}/) && displayWarning) {
        console.warn('ChatMessage parsed with unsupported color', this.color)
      }

      // Parse click event
      if (typeof json.clickEvent === 'object') {
        this.clickEvent = json.clickEvent
        if (typeof this.clickEvent.action !== 'string') {
          throw new Error('ClickEvent action missing in ChatMessage')
        } else if (Array.prototype.indexOf && supportedClick.indexOf(this.clickEvent.action) === -1 && displayWarning) {
          console.warn('ChatMessage parsed with unsupported clickEvent', this.clickEvent.action)
        }
      }

      // Parse hover event
      if (typeof json.hoverEvent === 'object') {
        this.hoverEvent = json.hoverEvent
        if (typeof this.hoverEvent.action !== 'string') {
          throw new Error('HoverEvent action missing in ChatMessage')
        } else if (Array.prototype.indexOf && supportedHover.indexOf(this.hoverEvent.action) === -1 && displayWarning) {
          console.warn('ChatMessage parsed with unsupported hoverEvent', this.hoverEvent.action)
        }
        // Special case
        if (this.hoverEvent.action === 'show_item') {
          let content
          if (this.hoverEvent.value instanceof Array) {
            if (this.hoverEvent.value[0] instanceof Object) {
              content = this.hoverEvent.value[0].text
            } else {
              content = this.hoverEvent.value[0]
            }
          } else {
            if (this.hoverEvent.value instanceof Object) {
              content = this.hoverEvent.value.text
            } else {
              content = this.hoverEvent.value
            }
          }
          try {
            this.hoverEvent.value = mojangson.parse(content)
          } catch (err) {

          }
        }
      }
    }

    /**
     * Append one or more ChatMessages
     * @param {...object|string} messages ChatMessage
     * @return {void}
     */
    append (...messages) {
      if (this.extra === undefined) this.extra = []
      messages.forEach((message) => {
        if (typeof message === 'object' && !Array.isArray(message)) {
          this.extra.push(message)
        } else if (typeof message === 'string') {
          this.extra.push(new ChatMessage(message))
        }
      })
    }

    /**
    * Returns a clone of the ChatMessage
    * @return {ChatMessage}
    */
    clone () {
      return new ChatMessage(JSON.parse(JSON.stringify(this.json)))
    }

    /**
     * Returns the count of text extras and child ChatMessages
     * Does not count recursively in to the children
     * @return {Number}
     */
    length () {
      let count = 0
      if (this.text) count++
      else if (this.with) count += this.with.length

      if (this.extra) count += this.extra.length
      return count
    }

    /**
     * Returns a text part from the message
     * @param  {Number} idx Index of the part
     * @return {String}
     */
    getText (idx, lang = defaultLang) {
      // If the index is not defined is is invalid, return toString
      if (typeof idx !== 'number') return this.toString(lang)
      // If we are not a translating message, return the text
      if (this.text && idx === 0) return this.text.replace(/§[0-9a-flnmokr]/g, '')
      // Else return the with child if it's in range
      else if (this.with.length > idx) return this.with[idx].toString(lang)
      // Else return the extra if it's in range
      if (this.extra && this.extra.length + (this.text ? 1 : this.with.length) > idx) {
        return this.extra[idx - (this.text ? 1 : this.with.length)].toString(lang)
      }
      // Not sure how you want to default this
      // Undefined, an error ?
      return ''
    }

    /**
     * Flattens the message in to plain-text
     * @return {String}
     */
    toString (lang = defaultLang) {
      let message = ''
      if (typeof this.text === 'string' || typeof this.text === 'number') message += this.text
      else if (this.with) {
        const args = this.with.map(entry => entry.toString(lang))
        const format = lang[this.translate]
        if (!format) message += args.join('')
        else message += vsprintf(format, args)
      } else if (this.translate) {
        message += lang[this.translate]
      }
      if (this.extra) {
        message += this.extra.map((entry) => entry.toString(lang)).join('')
      }
      return message.replace(/§[0-9a-flnmokr]/g, '')
    }

    valueOf () {
      return this.toString()
    }

    toMotd (lang = defaultLang, parent = {}) {
      const codes = {
        color: {
          black: '§0',
          dark_blue: '§1',
          dark_green: '§2',
          dark_aqua: '§3',
          dark_red: '§4',
          dark_purple: '§5',
          gold: '§6',
          gray: '§7',
          dark_gray: '§8',
          blue: '§9',
          green: '§a',
          aqua: '§b',
          red: '§c',
          light_purple: '§d',
          yellow: '§e',
          white: '§f',
          reset: '§r'
        },
        bold: '§l',
        italic: '§o',
        underlined: '§n',
        strikethrough: '§m',
        obfuscated: '§k'
      }

      let message = Object.keys(codes).map((code) => {
        this[code] = this[code] || parent[code]
        if (!this[code] || this[code] === 'false'/* || this.text === '' */) return null
        if (code === 'color') {
          // return hex codes in this format
          if (this.color.startsWith('#')) return `§${this.color}`
          return codes.color[this.color]
        }
        return codes[code]
      }).join('')

      if ((typeof this.text === 'string' || typeof this.text === 'number')/* && this.text !== '' */) message += this.text
      else if (this.with) {
        const args = this.with.map(entry => {
          const entryAsMotd = entry.toMotd(lang, this)
          return entryAsMotd + (entryAsMotd.includes('§') ? '§r' + message : '')
        })
        const format = lang[this.translate]
        if (!format) message += args.join('')
        else message += vsprintf(format, args)
      } else if (this.translate) {
        message += lang[this.translate]
      }
      if (this.extra) {
        message += this.extra.map(entry => entry.toMotd(lang, this)).join('')
      }
      return message
    }

    toAnsi (lang = defaultLang) {
      const codes = {
        '§0': '\u001b[30m',
        '§1': '\u001b[34m',
        '§2': '\u001b[32m',
        '§3': '\u001b[36m',
        '§4': '\u001b[31m',
        '§5': '\u001b[35m',
        '§6': '\u001b[33m',
        '§7': '\u001b[37m',
        '§8': '\u001b[90m',
        '§9': '\u001b[94m',
        '§a': '\u001b[92m',
        '§b': '\u001b[96m',
        '§c': '\u001b[91m',
        '§d': '\u001b[95m',
        '§e': '\u001b[93m',
        '§f': '\u001b[97m',
        '§l': '\u001b[1m',
        '§o': '\u001b[3m',
        '§n': '\u001b[4m',
        '§m': '\u001b[9m',
        '§k': '\u001b[6m',
        '§r': '\u001b[0m'
      }

      let message = this.toMotd(lang)
      for (const k in codes) {
        message = message.replace(new RegExp(k, 'g'), codes[k])
      }
      const hexRegex = /§#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})/
      while (message.search(hexRegex) !== -1) {
        // Stolen from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        const hexCodes = hexRegex.exec(message)
        // Iterate over each hexColorCode match (§#69420, §#ABCDEF, §#A1B2C3)
        const red = parseInt(hexCodes[1], 16)
        const green = parseInt(hexCodes[2], 16)
        const blue = parseInt(hexCodes[3], 16)
        // ANSI from https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#rgb-colors
        message = message.replace(hexRegex, `\u001b[38;2;${red};${green};${blue}m`)
      }
      return codes['§r'] + message + codes['§r']
    }

    static fromNotch (msg) {
      let toRet
      try {
        toRet = new ChatMessage(JSON.parse(msg))
      } catch (e) {
        toRet = new ChatMessage(msg)
      }
      return toRet
    }

    // 1.19 applies chat formatting on the client side. A format string is provided like in C printf
    // syntax, including positional arguments which we poll from the supplied parameters map.
    // For example,
    //  printf("<%s> %s" /* fmt string */, [sender], [content])
    static fromNetwork (type, params) {
      const msg = new ChatMessage('')
      const format = registry.chatFormattingById[type]
      const fstr = format.formatString
      const slices = []
      for (let i = 0, j = 0, k = 0; i < fstr.length; i++) {
        const c = fstr[i]
        const cNext = fstr[i + 1]
        if (c === '%' && cNext === 's') {
          slices.push(fstr.slice(j, i), new ChatMessage(params[format.parameters[k++]]))
          i++
          j = i + 1
          continue
        } else if (cNext == null) {
          slices.push(fstr.slice(j))
        }
      }
      for (const slice of slices) msg.append(slice)
      return msg
    }
  }

  ChatMessage.MessageBuilder = MessageBuilder
  return ChatMessage
}
