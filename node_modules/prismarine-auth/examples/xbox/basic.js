const { Authflow } = require('prismarine-auth')
const flow = new Authflow() // No parameters needed
module.exports = flow.getXboxToken().then(console.log)
