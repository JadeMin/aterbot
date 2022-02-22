const { Authflow, Titles } = require('prismarine-auth')
const crypto = require('crypto')
const curve = 'secp384r1'

const [, , username, cacheDir] = process.argv

if (!username) {
  console.log('Usage: node deviceCode.js <username> <cacheDirectory>')
  process.exit(1)
}

const keypair = crypto.generateKeyPairSync('ec', { namedCurve: curve }).toString('base64')
const doAuth = async () => {
  const flow = new Authflow(username, cacheDir, { authTitle: Titles.MinecraftNintendoSwitch, deviceType: 'Nintendo' })
  const XSTSToken = await flow.getMinecraftBedrockToken(keypair)
  console.log(XSTSToken)
}

module.exports = doAuth()
