const mojangson = require('mojangson')
const nbt = require('prismarine-nbt')

const supportedColors = {
  0: 'black',
  1: 'dark_blue',
  2: 'dark_green',
  3: 'dark_aqua',
  4: 'dark_red',
  5: 'dark_purple',
  6: 'gold',
  7: 'gray',
  8: 'dark_gray',
  9: 'blue',
  a: 'green',
  b: 'aqua',
  c: 'red',
  d: 'light_purple',
  e: 'yellow',
  f: 'white',
  k: 'obfuscated',
  l: 'bold',
  m: 'strikethrough',
  n: 'underlined',
  o: 'italic',
  r: 'reset'
}

function loader (version) {
  class MessageBuilder {
    constructor () {
      this.with = []
      this.extra = []
    }

    /** @param {boolean} val */
    setBold (val) { this.bold = val; return this }
    /** @param {boolean} val */
    setItalic (val) { this.italic = val; return this }
    /** @param {boolean} val */
    setUnderlined (val) { this.underlined = val; return this }
    /** @param {boolean} val */
    setStrikethrough (val) { this.strikethrough = val; return this }
    /** @param {boolean} val */
    setObfuscated (val) { this.obfuscated = val; return this }
    /** @param {string} val */
    setColor (val) { this.color = val; return this }
    /** @param {string} val */
    setText (val) { this.text = val; return this }
    /**
     * The resource location of the font for this component in the resource pack within `assets/<namespace>/font`.
     * @param {string} val Defaults to `minecraft:default`
     * @returns
     */
    setFont (val) { this.font = val; return this }
    /**
     * When used, it's expected that all slots for text will be filled using .addWith()
     * @param {string} val
     * @returns
     */
    setTranslate (val) { this.translate = val; return this }
    /**
     * text shown when shift clicked on message
     * @param {string} val
     */
    setInsertion (val) { this.insertion = val; return this }
    /**
     * Overrode by .setText()
     * @param {string} val
     * @example
     * builder.setKeybind('key.inventory')
     */
    setKeybind (val) { this.keybind = val; return this }
    /**
     * Displays a score holder's current score in an objective.
     * Displays nothing if the given score holder or the given objective do not exist, or if the score holder is not tracked in the objective.
     * @param {string} name if '*', show reader their own score. Otherwise, this is the player's score shown. Can be a selector string, but must never select more than one entity.
     * @param {string} objective The internal name of the objective to display the player's score in.
     */
    setScore (name, objective) { this.score = { name, objective }; return this }
    /**
     * @param {'open_url'|'run_command'|'suggest_command'|'change_page'|'copy_to_clipboard'} action
     * @param {string|number} value
     * @example
     * builder.setClickEvent('open_url', 'https://google.com')
     * builder.setClickEvent('run_command', '/say Hi!') // for signs, the slash doesn't need to be there
     * builder.setClickEvent('suggest_command', '/say ')
     * builder.setClickEvent('change_page', '/say Hi!') // Can only be used in written books
     * builder.setClickEvent('copy_to_clipboard', 'welcome to your clipboard')
     */
    setClickEvent (action, value) { this.clickEvent = { action, value }; return this }
    /**
     * @param {'show_text'|'show_entity'|'show_item'} action
     * @param {import('prismarine-item').Item|import('prismarine-entity').Entity|MessageBuilder} data
     * @param {'contents'|'value'} type [type='contents']
     */
    setHoverEvent (action, data, type = 'contents') {
      const hoverEvent = { action }
      if (type === 'contents') {
        switch (action) {
          case 'show_item':
            hoverEvent.contents = {
              id: `minecraft:${data.name}`,
              count: data.count,
              tag: data.nbt ? mojangson.stringify(data.nbt) : {}
            }
            break
          case 'show_entity':
            hoverEvent.contents = {
              name: data.displayName,
              type: `minecraft:${data.name}`,
              id: data.uuid
            }
            break
          case 'show_text':
            hoverEvent.contents = data
            break
          default:
            throw Error('Not implemented')
        }
      } else if (type === 'value') {
        switch (action) {
          case 'show_item':
            // works for 1.12.2 & 1.17
            hoverEvent.value = mojangson.stringify(nbt.comp({
              id: nbt.string(`minecraft:${data.name}`),
              Count: nbt.byte(data.count),
              tag: data.nbt || nbt.comp({}),
              Damage: nbt.short(0)
            }))
            break
          case 'show_text':
            hoverEvent.value = data.toString()
            break
          case 'show_entity':
          default:
            throw Error('Not implemented')
        }
      }
      this.hoverEvent = hoverEvent
      return this
    }

    /**
     * appended to the end of this message object with the existing formatting.
     * formatting can be overrode in child messagebuilder
     * @param {Array<MessageBuilder | string>} ...args
     * @returns
     */
    addExtra (...args) {
      for (const v of args) {
        const value = typeof v === 'string' ? v : v.toJSON()
        this.extra.push(value)
      }
      return this
    }

    /**
     * requires .translate to be set for this to be used
     * @param {Array<MessageBuilder | string>} ...args
     * @returns
     */
    addWith (...args) {
      for (const v of args) {
        const value = typeof v === 'string' ? v : v.toJSON()
        this.with.push(value)
      }
      return this
    }

    resetFormatting () {
      this.setBold(false)
      this.setItalic(false)
      this.setUnderlined(false)
      this.setStrikethrough(false)
      this.setObfuscated(false)
      this.setColor('reset')
    }

    toJSON () {
      const isDef = x => x !== undefined
      const obj = {}
      if (isDef(this.strikethrough)) obj.strikethrough = this.strikethrough
      if (isDef(this.obfuscated)) obj.obfuscated = this.obfuscated
      if (isDef(this.underlined)) obj.underlined = this.underlined
      if (isDef(this.clickEvent)) obj.clickEvent = this.clickEvent
      if (isDef(this.hoverEvent)) obj.hoverEvent = this.hoverEvent
      if (isDef(this.translate)) obj.translate = this.translate
      if (isDef(this.insertion)) obj.insertion = this.insertion
      if (isDef(this.italic)) obj.italic = this.italic
      if (isDef(this.color)) obj.color = this.color
      if (isDef(this.bold)) obj.bold = this.bold
      if (isDef(this.font)) obj.font = this.font
      if (isDef(this.text)) { // text > keybind > score
        obj.text = this.text
      } else if (isDef(this.keybind)) {
        obj.keybind = this.keybind
      } else if (isDef(this.score)) {
        obj.score = this.score
      }
      if (isDef(this.translate) && this.with.length > 0) {
        obj.with = this.with
      }
      if (this.extra.length > 0) {
        obj.extra = this.extra
      }
      return obj
    }

    toString () {
      return JSON.stringify(this)
    }

    static fromString (str, { colorSeparator = '&' } = {}) {
      let lastObj = null
      let currString = ''
      for (let i = str.length - 1; i > -1; i--) {
        const char = str.substring(i, i + 1)
        if (char !== colorSeparator) currString += char
        else {
          const text = currString.split('').reverse()
          const color = supportedColors[text.shift()]
          const newObj = new MessageBuilder()
          if (color === 'obfuscated') {
            newObj.setObfuscated(true)
          } else if (color === 'bold') {
            newObj.setBold(true)
          } else if (color === 'strikethrough') {
            newObj.setStrikethrough(true)
          } else if (color === 'underlined') {
            newObj.setUnderlined(true)
          } else if (color === 'italic') {
            newObj.setItalic(true)
          } else if (color === 'reset') {
            newObj.resetFormatting()
          } else {
            newObj.setColor(color)
          }
          newObj.setText(text.join(''))
          if (lastObj === null) lastObj = newObj
          else lastObj = newObj.addExtra(lastObj)
          currString = ''
        }
      }
      if (currString !== '') {
        const txt = currString.split('').reverse().join('')
        if (lastObj !== null) lastObj = new MessageBuilder().setText(txt).addExtra(lastObj)
        else lastObj = new MessageBuilder().setText(txt)
      }
      return lastObj
    }
  }

  return { MessageBuilder }
}

module.exports = loader
