const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const assert = require('assert')
const debug = require('debug')('prismarine-auth')

const { Endpoints, msalConfig } = require('./common/Constants')
const FileCache = require('./common/cache/FileCache')

const LiveTokenManager = require('./TokenManagers/LiveTokenManager')
const JavaTokenManager = require('./TokenManagers/MinecraftJavaTokenManager')
const XboxTokenManager = require('./TokenManagers/XboxTokenManager')
const MsaTokenManager = require('./TokenManagers/MsaTokenManager')
const BedrockTokenManager = require('./TokenManagers/MinecraftBedrockTokenManager')

async function retry (methodFn, beforeRetry, times) {
  while (times--) {
    if (times !== 0) {
      try { return await methodFn() } catch (e) { if (e instanceof URIError) { throw e } else { debug(e) } }
      await new Promise(resolve => setTimeout(resolve, 2000))
      await beforeRetry()
    } else {
      return await methodFn()
    }
  }
}

class MicrosoftAuthFlow {
  constructor (username = '', cache = __dirname, options = {}, codeCallback) {
    this.username = username
    this.options = options
    this.initTokenManagers(username, cache)
    this.codeCallback = codeCallback
    this.xbl.relyingParty = options.relyingParty ?? Endpoints.BedrockXSTSRelyingParty
  }

  initTokenManagers (username, cache) {
    if (typeof cache !== 'function') {
      let cachePath = cache

      debug(`Using cache path: ${cachePath}`)

      try {
        if (!fs.existsSync(cachePath)) {
          fs.mkdirSync(cachePath, { recursive: true })
        }
      } catch (e) {
        console.log('Failed to open cache dir', e)
        cachePath = __dirname
      }

      cache = ({ cacheName, username }) => {
        const hash = sha1(username).substr(0, 6)
        return new FileCache(path.join(cachePath, `./${hash}_${cacheName}-cache.json`))
      }
    }

    if (this.options.authTitle) { // Login with login.live.com
      const scopes = ['service::user.auth.xboxlive.com::MBI_SSL']
      this.msa = new LiveTokenManager(this.options.authTitle, scopes, cache({ cacheName: 'live', username }))
    } else { // Login with microsoftonline.com
      const scopes = ['XboxLive.signin', 'offline_access']
      this.msa = new MsaTokenManager(msalConfig, scopes, cache({ cacheName: 'msa', username }))
    }

    const keyPair = crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' })
    this.xbl = new XboxTokenManager(keyPair, cache({ cacheName: 'xbl', username }))
    this.mba = new BedrockTokenManager(cache({ cacheName: 'bed', username }))
    this.mca = new JavaTokenManager(cache({ cacheName: 'mca', username }))
  }

  static resetTokenCaches (cache) {
    if (!cache) throw new Error('You must provide a cache directory to reset.')
    try {
      if (fs.existsSync(cache)) {
        fs.rmSync(cache, { recursive: true })
        return true
      }
    } catch (e) {
      console.log('Failed to clear cache dir', e)
      return false
    }
  }

  async getMsaToken () {
    if (await this.msa.verifyTokens()) {
      debug('[msa] Using existing tokens')
      const { token } = await this.msa.getAccessToken()
      return token
    } else {
      debug('[msa] No valid cached tokens, need to sign in')
      const ret = await this.msa.authDeviceCode((response) => {
        console.info('[msa] First time signing in. Please authenticate now:')
        console.info(response.message)
        if (this.codeCallback) this.codeCallback(response)
      })

      if (ret.account) {
        console.info(`[msa] Signed in as ${ret.account.username}`)
      } else { // We don't get extra account data here per scope
        console.info('[msa] Signed in with Microsoft')
      }

      debug('[msa] got auth result', ret)
      return ret.accessToken
    }
  }

  async getXboxToken () {
    if (await this.xbl.verifyTokens()) {
      debug('[xbl] Using existing XSTS token')
      const { data } = await this.xbl.getCachedXstsToken()
      return data
    } else if (this.options.password) {
      debug('[xbl] password is present, trying to authenticate using xboxreplay/xboxlive-auth')
      const xsts = await this.xbl.doReplayAuth(this.username, this.options.password)
      return xsts
    } else {
      debug('[xbl] Need to obtain tokens')
      return await retry(async () => {
        const msaToken = await this.getMsaToken()

        if (this.options.doSisuAuth) {
          assert(this.options.authTitle !== undefined, 'Please specify an "authTitle" in Authflow constructor when using sisu authentication')
          debug(`[xbl] Sisu flow selected, trying to authenticate with authTitle ID ${this.options.authTitle}`)
          const deviceToken = await this.xbl.getDeviceToken(this.options)
          const sisu = await this.xbl.doSisuAuth(msaToken, deviceToken, this.options)
          return sisu
        }

        const ut = await this.xbl.getUserToken(msaToken, !this.options.authTitle)

        if (this.options.authTitle) {
          const deviceToken = await this.xbl.getDeviceToken(this.options)
          const titleToken = await this.xbl.getTitleToken(msaToken, deviceToken)
          const xsts = await this.xbl.getXSTSToken(ut, deviceToken, titleToken)
          return xsts
        } else {
          const xsts = await this.xbl.getXSTSToken(ut)
          return xsts
        }
      }, () => { this.msa.forceRefresh = true }, 2)
    }
  }

  async getMinecraftJavaToken (options = {}) {
    assert(this.options.authTitle !== undefined, 'Please specify an "authTitle" in Authflow constructor')
    const response = { token: '', entitlements: {}, profile: {} }
    if (await this.mca.verifyTokens()) {
      debug('[mc] Using existing tokens')
      const { token } = await this.mca.getCachedAccessToken()
      response.token = token
    } else {
      this.xbl.relyingParty = Endpoints.PCXSTSRelyingParty
      debug('[mc] Need to obtain tokens')
      await retry(async () => {
        const xsts = await this.getXboxToken()
        debug('[xbl] xsts data', xsts)
        response.token = await this.mca.getAccessToken(xsts)
      }, () => { this.xbl.forceRefresh = true }, 2)
    }

    if (options.fetchEntitlements) {
      response.entitlements = await this.mca.fetchEntitlements(response.token).catch(e => debug('Failed to obtain entitlement data', e))
    }
    if (options.fetchProfile) {
      response.profile = await this.mca.fetchProfile(response.token).catch(e => debug('Failed to obtain profile data', e))
    }

    return response
  }

  async getMinecraftBedrockToken (publicKey) {
    assert(this.options.authTitle !== undefined, 'Please specify an "authTitle" in Authflow constructor')
    // TODO: Fix cache, in order to do cache we also need to cache the ECDH keys so disable it
    // is this even a good idea to cache?
    if (await this.mba.verifyTokens() && false) { // eslint-disable-line
      debug('[mc] Using existing tokens')
      const { chain } = this.mba.getCachedAccessToken()
      return chain
    } else {
      if (!publicKey) throw new Error('Need to specifiy a ECDH x509 URL encoded public key')
      this.xbl.relyingParty = Endpoints.BedrockXSTSRelyingParty
      debug('[mc] Need to obtain tokens')
      return await retry(async () => {
        const xsts = await this.getXboxToken()
        debug('[xbl] xsts data', xsts)
        const token = await this.mba.getAccessToken(publicKey, xsts)
        // If we want to auth with a title ID, make sure there's a TitleID in the response
        const body = JSON.parse(Buffer.from(token.chain[1].split('.')[1], 'base64').toString())
        if (!body.extraData.titleId && this.options.authTitle) {
          throw Error('missing titleId in response')
        }
        return token.chain
      }, () => { this.xbl.forceRefresh = true }, 2)
    }
  }
}

function sha1 (data) {
  return crypto.createHash('sha1').update(data ?? '', 'binary').digest('hex')
}

module.exports = MicrosoftAuthFlow
