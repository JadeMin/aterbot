const debug = require('debug')('prismarine-auth')
const fetch = require('node-fetch')

const { Endpoints } = require('../common/Constants')
const { checkStatus } = require('../common/Util')

class BedrockTokenManager {
  constructor (cache) {
    this.cache = cache
  }

  async getCachedAccessToken () {
    const { mca: token } = await this.cache.getCached()
    debug('[mc] token cache', token)
    if (!token) return
    debug('Auth token', token)
    const jwt = token.chain[0]
    const [header, payload, signature] = jwt.split('.').map(k => Buffer.from(k, 'base64')) // eslint-disable-line

    const body = JSON.parse(String(payload))
    const expires = new Date(body.exp * 1000)
    const remainingMs = expires - Date.now()
    const valid = remainingMs > 1000
    return { valid, until: expires, chain: token.chain }
  }

  async setCachedAccessToken (data) {
    await this.cache.setCachedPartial({
      mca: {
        ...data,
        obtainedOn: Date.now()
      }
    })
  }

  async verifyTokens () {
    const at = await this.getCachedAccessToken()
    if (!at || this.forceRefresh) {
      return false
    }
    debug('[mc] have user access token', at)
    if (at.valid) {
      return true
    }
    return false
  }

  async getAccessToken (clientPublicKey, xsts) {
    debug('[mc] authing to minecraft', clientPublicKey, xsts)
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'MCPE/UWP',
      Authorization: `XBL3.0 x=${xsts.userHash};${xsts.XSTSToken}`
    }
    const MineServicesResponse = await fetch(Endpoints.BedrockAuth, {
      method: 'post',
      headers,
      body: JSON.stringify({ identityPublicKey: clientPublicKey })
    }).then(checkStatus)

    debug('[mc] mc auth response', MineServicesResponse)
    await this.setCachedAccessToken(MineServicesResponse)
    return MineServicesResponse
  }
}

module.exports = BedrockTokenManager
