// Just importing these will run the code ; any exceptions will crash script
process.argv = ['', '', 'user@example.com']
const TESTS = [
  ['xbox', 'prismarine-auth/examples/xbox/basic'],
  ['minecraft bedrock edition', 'prismarine-auth/examples/mcpc/deviceCode'],
  ['minecraft java edition', 'prismarine-auth/examples/mcpc/deviceCode']
]

console.log('Running device code tests')
async function main () {
  for (const [name, file] of TESTS) {
    console.log('Testing', name, '...')
    await require(file)
    console.log('✔️', file)
  }
  console.log('✔️ All OK')
}
main()
