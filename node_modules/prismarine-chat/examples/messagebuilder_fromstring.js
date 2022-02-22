const version = '1.17'
const { MessageBuilder } = require('prismarine-chat')(version)

const example = '&0&l[&4You&fTube&0]'
const json = JSON.stringify(MessageBuilder.fromString(example))
console.log(json)
