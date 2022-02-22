const uuid = require('uuid')
const utils = require('./utils')

const defaultHost = 'https://authserver.mojang.com'

function loader (moduleOptions) {
  /**
   * Attempts to authenticate a user.
   * @param  {Object}   options Config object
   * @param  {Function} cb      Callback
   */
  async function auth (options) {
    if (options.token === null) delete options.token
    else options.token = options.token ?? uuid.v4()

    options.agent = options.agent ?? 'Minecraft'

    return await utils.call(
      moduleOptions?.host ?? defaultHost,
      'authenticate',
      {
        agent: {
          name: options.agent,
          version: options.agent === 'Minecraft' ? 1 : options.version
        },
        username: options.user,
        password: options.pass,
        clientToken: options.token,
        requestUser: options.requestUser === true
      },
      moduleOptions?.agent
    )
  }
  /**
   * Refreshes a accessToken.
   * @param  {String}   accessToken Old Access Token
   * @param  {String}   clientToken Client Token
   * @param  {String=false}   requestUser Whether to request the user object
   * @param  {Function} cb     (err, new token, full response body)
   */

  async function refresh (accessToken, clientToken, requestUser) {
    const data = await utils.call(moduleOptions?.host ?? defaultHost, 'refresh', { accessToken, clientToken, requestUser: requestUser ?? false },
      moduleOptions?.agent)
    if (data.clientToken !== clientToken) throw new Error('clientToken assertion failed')
    return [data.accessToken, data]
  }
  /**
   * Validates an access token
   * @param  {String}   accessToken Token to validate
   * @param  {Function} cb    (error)
   */
  async function validate (accessToken) {
    return await utils.call(moduleOptions?.host ?? defaultHost, 'validate', { accessToken }, moduleOptions?.agent)
  }

  /**
   * Invalidates all access tokens.
   * @param  {String}   username User's user
   * @param  {String}   password User's pass
   * @param  {Function} cb   (error)
   */
  async function signout (username, password) {
    return await utils.call(moduleOptions?.host ?? defaultHost, 'signout', { username, password }, moduleOptions?.agent)
  }
  return {
    auth: utils.callbackify(auth, 1),
    refresh: utils.callbackify(refresh, 3),
    signout: utils.callbackify(signout, 1),
    validate: utils.callbackify(validate, 2)
  }
}

module.exports = loader
