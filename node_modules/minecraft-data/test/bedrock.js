/* eslint-env mocha */
// const assert = require('assert')
// const packets = require('minecraft-packets').bedrock

// function test (version) {
//   console.log('->', version)
//   const packet = packets[version]['from-server']
//   const mcd = require('minecraft-data')('bedrock_' + version)
//   if (!mcd.items) {
//     console.log(`Don't have data for '${version}', skipping`)
//     return
//   }
//   mcd.loadItemPalette(packet.start_game[-1].json.itemstates)
//   const { item, block } = mcd.findItemByName('acacia_trapdoor')
//   assert.ok(item)
//   assert.ok(block)
//   assert.strictEqual(mcd.findItemByRuntimeId(1).blockId, 1)
// }

// describe('can query bedrock items', function () {
//   for (const version in packets) {
//     it('works on ' + version, function () {
//       test(version)
//     })
//   }
// })
