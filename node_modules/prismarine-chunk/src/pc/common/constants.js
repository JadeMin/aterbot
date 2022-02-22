// height in blocks of a chunk column
const CHUNK_HEIGHT = 256

// width in blocks of a chunk column
const CHUNK_WIDTH = 16

// height in blocks of a chunk section
const SECTION_HEIGHT = 16

// width in blocks of a chunk section
const SECTION_WIDTH = 16

// volume in blocks of a chunk section
const BLOCK_SECTION_VOLUME = SECTION_HEIGHT * SECTION_WIDTH * SECTION_WIDTH

// number of chunk sections in a chunk column
const NUM_SECTIONS = 16

// minimum number of bits per block allowed when using the section palette.
const MIN_BITS_PER_BLOCK = 4

// maximum number of bits per block allowed when using the section palette.
// values above will switch to global palette
const MAX_BITS_PER_BLOCK = 8

// number of bits used for each block in the global palette.
// this value should not be hardcoded according to wiki.vg
const GLOBAL_BITS_PER_BLOCK = 16

const BIOME_SECTION_VOLUME = BLOCK_SECTION_VOLUME / (4 * 4 * 4) | 0

const MIN_BITS_PER_BIOME = 1

const MAX_BITS_PER_BIOME = 3

module.exports = {
  CHUNK_HEIGHT,
  CHUNK_WIDTH,
  SECTION_HEIGHT,
  SECTION_WIDTH,
  BLOCK_SECTION_VOLUME,
  NUM_SECTIONS,
  MIN_BITS_PER_BLOCK,
  MAX_BITS_PER_BLOCK,
  GLOBAL_BITS_PER_BLOCK,
  BIOME_SECTION_VOLUME,
  MIN_BITS_PER_BIOME,
  MAX_BITS_PER_BIOME
}
