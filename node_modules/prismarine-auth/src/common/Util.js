const debug = require('debug')('prismarine-auth')

async function checkStatus (res) {
  if (res.ok) { // res.status >= 200 && res.status < 300
    return res.json()
  } else {
    const resp = await res.json()
    debug('Request fail', resp)
    throw Error(`${res.statusText}: ${JSON.stringify(resp)}`)
  }
}

module.exports = { checkStatus }
