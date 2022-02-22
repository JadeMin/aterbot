/* global ctx */
module.exports = {
  Read: {
    compound: ['context', (buffer, offset) => {
      const results = {
        value: {},
        size: 0
      }
      while (offset !== buffer.length) {
        const typ = ctx.i8(buffer, offset)
        if (typ.value === 0) {
          results.size += typ.size
          break
        }

        if (typ.value > 20) {
          throw new Error(`Invalid tag: ${typ.value} > 20`)
        }

        const readResults = ctx.nbt(buffer, offset)
        offset += readResults.size
        results.size += readResults.size
        results.value[readResults.value.name] = {
          type: readResults.value.type,
          value: readResults.value.value
        }
      }
      return results
    }]
  },

  Write: {
    compound: ['context', (value, buffer, offset) => {
      for (const key in value) {
        offset = ctx.nbt({
          name: key,
          type: value[key].type,
          value: value[key].value
        }, buffer, offset)
      }
      offset = ctx.i8(0, buffer, offset)
      return offset
    }]
  },

  SizeOf: {
    compound: ['context', (value) => {
      let size = 1
      for (const key in value) {
        size += ctx.nbt({
          name: key,
          type: value[key].type,
          value: value[key].value
        })
      }
      return size
    }]
  }
}
