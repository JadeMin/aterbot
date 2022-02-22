const nmp = require('minecraft-protocol')
const { startServer } = require('./downloadMcpcServer')
const debug = require('debug')('prismarine-registry')

async function collectPackets (version, names = ['login'], cb) {
  const collected = []
  const server = await startServer(version, 25569)
  console.log('Started server')

  const client = nmp.createClient({
    version: version,
    host: 'localhost',
    port: 25569,
    username: 'test'
  })

  let clientConnected = false

  client.on('connect', () => {
    console.log('[client] Client connected')
    clientConnected = true
  })

  for (const name of names) {
    client.on(name, (packet) => {
      cb(name, packet)
      collected.push(packet)
    })
  }

  client.on('packet', (data, { name }) => debug('[client] -> ', name))

  setTimeout(() => {
    console.log('Stopping server')
    server.stop()
    client.end()
    if (!clientConnected) {
      throw new Error('Client never connected')
    }
  }, 9000)
}

module.exports = collectPackets
