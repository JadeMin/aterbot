const ChatMessage = require('prismarine-chat')('1.8')
const { createClient } = require('minecraft-protocol')

if (process.argv.length < 4 || process.argv.length > 6) {
  console.log('Usage : node fromnotch.js <host> <port> [<name>] [<password>]')
  process.exit(1)
}

const client = createClient({
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  username: process.argv[4] ? process.argv[4] : 'chatty',
  password: process.argv[5]
})

client.on('chat', ({ message }) => {
  if (message.includes(client.username)) return
  const msg = ChatMessage.fromNotch(message).toString()
  client.write('chat', { message: msg })
})
