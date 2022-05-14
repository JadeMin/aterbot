const nf = require('node-fetch')

const { version } = require('../package.json'); // eslint-disable-line

const headers = {
  'User-Agent': `node-yggdrasil/${version}`,
  'Content-Type': 'application/json'
}

/**
 * Generic POST request
 */
async function call (host, path, data, agent) {
  const resp = await nf(`${host}/${path}`, { agent, body: JSON.stringify(data), headers, method: 'POST' })
  let body = await resp.text()
  if (body.length === 0) return ''
  try {
    body = JSON.parse(body)
  } catch (e) {
    if (e instanceof SyntaxError) {
      if (resp.status === 403) {
        if ((body).includes('Request blocked.')) {
          throw new Error('Request blocked by CloudFlare')
        }
        if ((body).includes('cf-error-code">1009')) {
          throw new Error('Your IP is banned by CloudFlare')
        }
      } else {
        throw new Error(`Response is not JSON. Status code: ${resp.status ?? 'no status code'}`)
      }
    } else {
      throw e
    }
  }
  if (body?.error !== undefined) throw new Error(body?.errorMessage ?? body?.error)
  return body
}
/**
 * Java's stupid hashing method
 * @param  {Buffer|String} hash     The hash data to stupidify
 * @param  {String} encoding Optional, passed to Buffer() if hash is a string
 * @return {String}          Stupidified hash
 */
function mcHexDigest (hash, encoding) {
  if (!(hash instanceof Buffer)) {
    hash = (Buffer).from(hash, encoding)
  }
  // check for negative hashes
  const negative = (hash).readInt8(0) < 0
  if (negative) performTwosCompliment(hash)
  return (negative ? '-' : '') + hash.toString('hex').replace(/^0+/g, '')
}

function callbackify (f, maxParams) {
  return function (...args) {
    let cb
    let i = args.length
    while (cb === undefined && i > 0) {
      if (typeof args[i - 1] === 'function') {
        cb = args[i - 1]
        args[i - 1] = undefined
        args[maxParams] = cb
        break
      }
      i--
    }
    return f(...args).then(
      (r) => {
        if (r[0] !== undefined) {
          cb?.(undefined, ...r)
          return r[r.length - 1]
        } else {
          cb?.(undefined, r)
          return r
        }
      },
      (err) => {
        if (typeof cb === 'function') cb(err)
        else throw err
      }
    )
  }
}

/**
 * Java's annoying hashing method.
 * All credit to andrewrk
 * https://gist.github.com/andrewrk/4425843
 */
function performTwosCompliment (buffer) {
  let carry = true
  let i, newByte, value
  for (i = buffer.length - 1; i >= 0; --i) {
    value = buffer.readUInt8(i)
    newByte = ~value & 0xff
    if (carry) {
      carry = newByte === 0xff
      buffer.writeUInt8(carry ? 0 : newByte + 1, i)
    } else {
      buffer.writeUInt8(newByte, i)
    }
  }
}

module.exports = {
  call: callbackify(call, 4),
  callbackify,
  mcHexDigest
}
