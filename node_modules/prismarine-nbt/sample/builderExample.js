const nbt = require('prismarine-nbt')

const writePlayerNbt = () => {}
writePlayerNbt({
  Air: nbt.short(300),
  Armor: nbt.list(
    nbt.comp({ Count: nbt.byte(0), Damage: nbt.short(0), Name: nbt.string('') }),
    nbt.comp({ Count: nbt.byte(0), Damage: nbt.short(0), Name: nbt.string('') }),
    nbt.comp({ Count: nbt.byte(0), Damage: nbt.short(0), Name: nbt.string('') })
  )
})
