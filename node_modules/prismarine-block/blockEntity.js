const nbt = require('prismarine-nbt')

module.exports = registry => {
  if (registry.version.type === 'pc') {
    const ChatMessage = require('prismarine-chat')(registry.version.majorVersion)
    return {
      sign: {
        get blockEntity () {
          // Compatibility for mineflayer, which changes .blockEntity for signs to contain ChatMessages instead of simplified NBT
          if (!this.entity) return undefined

          const prepareJson = (i) => {
            const data = this.entity.value[`Text${i}`].value
            if (!data || data === '') return ''
            const json = JSON.parse(data)
            if (json === null || !('text' in json)) return ''
            return json
          }

          return {
            id: this.entity.value.id || 'minecraft:sign',
            Text1: new ChatMessage(prepareJson(1)),
            Text2: new ChatMessage(prepareJson(2)),
            Text3: new ChatMessage(prepareJson(3)),
            Text4: new ChatMessage(prepareJson(4))
          }
        },

        set signText (text) {
          const texts = []
          if (typeof text === 'string') {
            // Sign line should look like JSON string of `{"text: "actualText"}`. Since we have plaintext, need to add in this JSON wrapper.
            texts.push(JSON.stringify(text.split('\n').map((t) => ({ text: t }))))
          } else if (Array.isArray(text)) {
            for (const t of text) {
              if (t.toJSON) { // prismarine-chat
                texts.push(JSON.stringify(t.toJSON()))
              } else if (typeof t === 'object') { // normal JS object
                texts.push(JSON.stringify(t))
              } else { // plaintext
                texts.push(JSON.stringify({ text: t }))
              }
            }
          }

          if (!this.entity) {
            this.entity = nbt.comp({
              id: nbt.string(registry.version['>=']('1.11') ? 'minecraft:sign' : 'Sign')
            })
          }

          Object.assign(this.entity.value, {
            Text1: nbt.string(texts[0] || ''),
            Text2: nbt.string(texts[1] || ''),
            Text3: nbt.string(texts[2] || ''),
            Text4: nbt.string(texts[3] || '')
          })
        },

        get signText () {
          if (!this.entity) {
            return ''
          }
          const texts = [this.entity.value.Text1.value, this.entity.value.Text2.value, this.entity.value.Text3.value, this.entity.value.Text4.value]
          return texts.map(text => typeof JSON.parse(text) === 'string' ? JSON.parse(text) : new ChatMessage(JSON.parse(text)).toString()).join('\n')
        }
      }
    }
  }

  if (registry.version.type === 'bedrock') {
    return {
      sign: {
        get signText () {
          if (!this.entity) {
            return ''
          }
          return this.entity.Text.value
        },

        set signText (text) {
          if (!this.entity) {
            this.entity = nbt.comp({
              id: nbt.string('Sign')
            })
          }

          Object.assign(this.entity.value, {
            Text: nbt.string(Array.isArray(text) ? text.join('\n') : text)
          })
        }
      }
    }
  }
}
