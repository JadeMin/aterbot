const promisify = require('util').promisify
const wrap = require('minecraft-wrap')
const downloadServer = promisify(wrap.downloadServer)
const path = require('path')
const debug = require('debug')('prismarine-registry')

async function startServer (version, port = 25569) {
  const MC_SERVER_PATH = path.join(__dirname, `server_${version}`)
  const MC_SERVER_JAR = path.join(__dirname, `server_${version}.jar`)

  console.log('🔻 Downloading server', version)
  await downloadServer(version, MC_SERVER_JAR)

  const vServer = new wrap.WrapServer(MC_SERVER_JAR, MC_SERVER_PATH)

  vServer.on('line', function (line) {
    debug(line)
  })

  console.log('▶ Starting server', port)

  const settings = {
    'online-mode': 'false',
    'server-port': port,
    'view-distance': 2,
    // 'generator-settings': 'minecraft:bedrock,minecraft:grass_block;minecraft:plains;',
    'level-type': 'flat'
  }

  await new Promise(resolve => vServer.startServer(settings, resolve))

  vServer.stop = async () => new Promise((resolve, reject) => vServer.stopServer(reject, resolve))

  return vServer
}

module.exports = { startServer }
