/* eslint-env mocha */
const assert = require('assert')
const nbt = require('prismarine-nbt')

describe('handles block entities', () => {
  for (const version of ['pc_1.15.2', 'bedrock_1.18.0']) {
    const registry = require('prismarine-registry')(version)
    const Block = require('prismarine-block')(registry)

    it('creates a block entity on ' + version, () => {
      const chest = Block.fromStateId(registry.blocksByName.chest.defaultState)
      const tag = nbt.comp({
        Items: nbt.list(nbt.comp([
          {
            Slot: nbt.int(13),
            id: nbt.string('minecraft:gray_die'),
            Count: nbt.int(1),
            Enchantments: nbt.list(nbt.comp([{
              lvl: nbt.int(3),
              id: nbt.string('minecraft:unbreaking'),
              display: nbt.comp({
                Lore: nbt.list(nbt.string(['{"text":"Unbreaking III"}']))
              })
            }]))
          }
        ]))
      })
      const simplified = nbt.simplify(tag)
      chest.entity = tag
      assert.deepEqual(simplified, chest.blockEntity)
    })

    describe('signs', function () {
      it('.blockEntity works on ' + version, () => {
        const sign = Block.fromStateId(registry.blocksByName.standing_sign?.defaultState || registry.blocksByName.oak_sign?.defaultState)
        const tag = {
          pc: nbt.comp({
            Text1: nbt.string('{"text":"Hello"}'),
            Text2: nbt.string('{"text":"World"}'),
            Text3: nbt.string('{"text":"!"}'),
            Text4: nbt.string('{"text":"?"}')
          }),
          bedrock: nbt.comp({
            Text: nbt.string('Hello\nWorld!')
          })
        }[registry.type]
        const simplified = nbt.simplify(tag)
        sign.entity = tag

        if (registry.type === 'pc') {
          assert.deepEqual(simplified.Text1, JSON.stringify(sign.blockEntity.Text1.json))
        }

        if (registry.type === 'bedrock') {
          assert.deepEqual(simplified.Text, sign.blockEntity.Text)
        }
      })

      it('.signText works on ' + version, () => {
        const sign = Block.fromStateId(registry.blocksByName.standing_sign?.defaultState || registry.blocksByName.oak_sign?.defaultState)
        sign.signText = ['Hello', 'World']

        if (registry.type === 'pc') {
          assert(sign.blockEntity.Text1.toString() === 'Hello')
          assert(sign.blockEntity.Text2.toString() === 'World')
        }

        if (registry.type === 'bedrock') {
          assert(sign.blockEntity.Text.toString() === 'Hello\nWorld')
          assert(sign.blockEntity.id === 'Sign')
        }
      })
    })
  }
})
