/* eslint-env mocha */
'use strict'

const crypto = require('crypto')
const assert = require('assert')
const nock = require('nock')

const utils = require('../src/utils')

describe('utils', () => {
  describe('call', () => {
    const google = 'https://google.com'
    const uscope = nock(google)

    it('should work when given valid data', done => {
      const bsdata = {
        cake: true,
        username: 'someone'
      }

      uscope.post('/test', {}).reply(200, bsdata)
      utils.call(google, 'test', {}, undefined, (err, data) => {
        assert.ifError(err)
        assert.deepStrictEqual(data, bsdata)
        done()
      })
    })

    it('should work when given valid data (promise)', async () => {
      const bsdata = {
        cake: true,
        username: 'someone'
      }

      uscope.post('/test', {}).reply(200, bsdata)
      const data = await utils.call(google, 'test', {}, undefined)
      assert.deepStrictEqual(data, bsdata)
    })

    it('should error on an error', done => {
      uscope.post('/test2', {}).reply(200, {
        error: 'ThisBeAError',
        errorMessage: 'Yep, you failed.'
      })
      utils.call(google, 'test2', {}, undefined, (err, data) => {
        assert.strictEqual(data, undefined)
        assert.ok(err instanceof Error)
        assert.strictEqual(err.message, 'Yep, you failed.')
        done()
      })
    })
    it('should error on an error (promise)', async () => {
      uscope.post('/test2', {}).reply(200, {
        error: 'ThisBeAError',
        errorMessage: 'Yep, you failed.'
      })
      try {
        await utils.call(google, 'test2', {}, undefined)
      } catch (e) {
        assert.ok(e instanceof Error)
        assert.strictEqual(e.message, 'Yep, you failed.')
      }
    })

    afterEach(() => {
      uscope.done()
    })
  })

  // mcHexDigest(sha1('catcatcat')) => -af59e5b1d5d92e5c2c2776ed0e65e90be181f2a
  describe('mcHexDigest', () => {
    it('should work against test data', () => {
      // circa http://wiki.vg/Protocol_Encryption#Client
      const testdata = {
        Notch: '4ed1f46bbe04bc756bcb17c0c7ce3e4632f06a48',
        jeb_: '-7c9d5b0044c130109a5d7b5fb5c317c02b4e28c1',
        simon: '88e16a1019277b15d58faf0541e11910eb756f6',
        dummy697: '-aa2358520428804697026992cf6035d7f096a00' // triggers 2's complement bug
      }

      Object.keys(testdata).forEach(name => {
        const hash = crypto.createHash('sha1').update(name).digest()
        assert.strictEqual(utils.mcHexDigest(hash), testdata[name])
      })
    })

    it('should handle negative hashes ending with a zero byte without crashing', () => {
      assert.strictEqual(utils.mcHexDigest(Buffer.from([-1, 0])), '-100')
    })
  })
})

const cscope = nock('https://authserver.mojang.com')
const ygg = require('../src/index')({})

describe('Yggdrasil', () => {
  describe('auth', () => {
    it('should work correctly', done => {
      cscope.post('/authenticate', {
        agent: {
          version: 1,
          name: 'Minecraft'
        },
        username: 'cake',
        password: 'hunter2',
        clientToken: 'bacon',
        requestUser: false
      }).reply(200, {
        worked: true
      })
      ygg.auth({
        user: 'cake',
        pass: 'hunter2',
        token: 'bacon'
      }, (err, data) => { // eslint-disable-line handle-callback-err
        if (err) {
          done(err)
          return
        }
        assert.deepStrictEqual(data, {
          worked: true
        })
        done()
      })
    })
    it('should work correctly (promise)', async () => {
      cscope.post('/authenticate', {
        agent: {
          version: 1,
          name: 'Minecraft'
        },
        username: 'cake',
        password: 'hunter2',
        clientToken: 'bacon',
        requestUser: false
      }).reply(200, {
        worked: true
      })
      const data = await ygg.auth({ user: 'cake', pass: 'hunter2', token: 'bacon' })
      assert.deepStrictEqual(data, { worked: true })
    })
    it('should work correctly with requestUser true', done => {
      cscope.post('/authenticate', {
        agent: {
          version: 1,
          name: 'Minecraft'
        },
        username: 'cake',
        password: 'hunter2',
        clientToken: 'bacon',
        requestUser: true
      }).reply(200, {
        worked: true
      })
      ygg.auth({
        user: 'cake',
        pass: 'hunter2',
        token: 'bacon',
        requestUser: true
      }, (err, data) => { // eslint-disable-line handle-callback-err
        if (err) {
          done(err)
          return
        }
        assert.deepStrictEqual(data, {
          worked: true
        })
        done()
      })
    })
    it('should work correctly with requestUser true (promise)', async () => {
      cscope.post('/authenticate', {
        agent: {
          version: 1,
          name: 'Minecraft'
        },
        username: 'cake',
        password: 'hunter2',
        clientToken: 'bacon',
        requestUser: true
      }).reply(200, {
        worked: true
      })
      const data = await ygg.auth({ user: 'cake', pass: 'hunter2', token: 'bacon', requestUser: true })
      assert.deepStrictEqual(data, { worked: true })
    })
  })
  describe('refresh', () => {
    it('should work correctly', done => {
      cscope.post('/refresh', {
        accessToken: 'bacon',
        clientToken: 'not bacon',
        requestUser: false
      }).reply(200, {
        accessToken: 'different bacon',
        clientToken: 'not bacon'
      })
      ygg.refresh('bacon', 'not bacon', (err, token) => {
        assert.ifError(err)
        assert.strictEqual(token, 'different bacon')
        done()
      })
    })
    it('should work correctly (promise)', async () => {
      cscope.post('/refresh', {
        accessToken: 'bacon',
        clientToken: 'not bacon',
        requestUser: false
      }).reply(200, {
        accessToken: 'different bacon',
        clientToken: 'not bacon'
      })
      const { accessToken } = await ygg.refresh('bacon', 'not bacon')
      assert.strictEqual(accessToken, 'different bacon')
    })
    it('should work correctly with requestUser true', done => {
      cscope.post('/refresh', {
        accessToken: 'bacon',
        clientToken: 'not bacon',
        requestUser: true
      }).reply(200, {
        accessToken: 'different bacon',
        clientToken: 'not bacon',
        user: {
          id: '4ed1f46bbe04bc756bcb17c0c7ce3e4632f06a48',
          properties: []
        }
      })
      ygg.refresh('bacon', 'not bacon', true, (err, token, data) => {
        assert.ifError(err)
        assert.strictEqual(token, 'different bacon')
        assert.ok(data.user)
        assert.ok(data.user.properties)
        assert.strictEqual(data.user.id, '4ed1f46bbe04bc756bcb17c0c7ce3e4632f06a48')
        done()
      })
    })
    it('should work correctly with requestUser true (promise)', async () => {
      cscope.post('/refresh', {
        accessToken: 'bacon',
        clientToken: 'not bacon',
        requestUser: true
      }).reply(200, {
        accessToken: 'different bacon',
        clientToken: 'not bacon',
        user: {
          id: '4ed1f46bbe04bc756bcb17c0c7ce3e4632f06a48',
          properties: []
        }
      })
      const data = await ygg.refresh('bacon', 'not bacon', true)
      assert.strictEqual(data.accessToken, 'different bacon')
      assert.ok(data.user)
      assert.ok(data.user.properties)
      assert.strictEqual(data.user.id, '4ed1f46bbe04bc756bcb17c0c7ce3e4632f06a48')
    })
    it('should error on invalid clientToken', done => {
      cscope.post('/refresh', {
        accessToken: 'bacon',
        clientToken: 'not bacon',
        requestUser: false
      }).reply(200, {
        accessToken: 'different bacon',
        clientToken: 'bacon'
      })
      ygg.refresh('bacon', 'not bacon', (err, token) => {
        assert.notStrictEqual(err, null)
        assert.ok(err instanceof Error)
        assert.strictEqual(err.message, 'clientToken assertion failed')
        done()
      })
    })
    it('should error on invalid clientToken (promise)', async () => {
      cscope.post('/refresh', {
        accessToken: 'bacon',
        clientToken: 'not bacon',
        requestUser: false
      }).reply(200, {
        accessToken: 'different bacon',
        clientToken: 'bacon'
      })
      try {
        await ygg.refresh('bacon', 'not bacon')
      } catch (e) {
        assert.notStrictEqual(e, null)
        assert.ok(e instanceof Error)
        assert.strictEqual(e.message, 'clientToken assertion failed')
      }
    })
  })
  describe('validate', () => {
    it('should return undefined on valid response', done => {
      cscope.post('/validate', {
        accessToken: 'a magical key'
      }).reply(200)
      ygg.validate('a magical key', err => {
        assert.ifError(err)
        done()
      })
    })
    it('should return undefined on valid response (promise)', async () => {
      cscope.post('/validate', {
        accessToken: 'a magical key'
      }).reply(200)
      await ygg.validate('a magical key')
    })
    it('should return Error on error', done => {
      cscope.post('/validate', {
        accessToken: 'a magical key'
      }).reply(403, {
        error: 'UserEggError',
        errorMessage: 'User is an egg'
      })
      ygg.validate('a magical key', err => {
        assert.ok(err instanceof Error)
        assert.strictEqual(err.message, 'User is an egg')
        done()
      })
    })
    it('should return Error on error (promise)', async () => {
      cscope.post('/validate', {
        accessToken: 'a magical key'
      }).reply(403, {
        error: 'UserEggError',
        errorMessage: 'User is an egg'
      })
      try {
        await ygg.validate('a magical key')
      } catch (e) {
        assert.ok(e instanceof Error)
        assert.strictEqual(e.message, 'User is an egg')
      }
    })
  })
  afterEach(() => {
    cscope.done()
  })
})

const sscope = nock('https://sessionserver.mojang.com')
const yggserver = require('../src/index').server({})

describe('Yggdrasil.server', () => {
  describe('join', () => {
    it('should work correctly', done => {
      sscope.post('/session/minecraft/join', {
        accessToken: 'anAccessToken',
        selectedProfile: 'aSelectedProfile',
        serverId: '-af59e5b1d5d92e5c2c2776ed0e65e90be181f2a'
      }).reply(200, {
        worked: true
      })

      yggserver.join('anAccessToken', 'aSelectedProfile', 'cat', 'cat', 'cat', (err, data) => { // eslint-disable-line handle-callback-err
        if (err) {
          done(err)
          return
        }
        assert.deepStrictEqual(data, {
          worked: true
        })
        done()
      })
    })
    it('should work correctly (promise)', async () => {
      sscope.post('/session/minecraft/join', {
        accessToken: 'anAccessToken',
        selectedProfile: 'aSelectedProfile',
        serverId: '-af59e5b1d5d92e5c2c2776ed0e65e90be181f2a'
      }).reply(200, {
        worked: true
      })
      const data = await yggserver.join('anAccessToken', 'aSelectedProfile', 'cat', 'cat', 'cat')
      assert.deepStrictEqual(data, { worked: true })
    })
  })

  describe('hasJoined', () => {
    it('should work correctly', done => {
      sscope.get('/session/minecraft/hasJoined?username=ausername&serverId=-af59e5b1d5d92e5c2c2776ed0e65e90be181f2a').reply(200, {
        id: 'cat',
        worked: true
      })

      yggserver.hasJoined('ausername', 'cat', 'cat', 'cat', (err, data) => {
        if (err) return done(err)
        assert.deepStrictEqual(data, {
          id: 'cat',
          worked: true
        })
        done()
      })
    })
    it('should work correctly (promise)', async () => {
      sscope.get('/session/minecraft/hasJoined?username=ausername&serverId=-af59e5b1d5d92e5c2c2776ed0e65e90be181f2a').reply(200, {
        id: 'cat',
        worked: true
      })

      const data = await yggserver.hasJoined('ausername', 'cat', 'cat', 'cat')
      assert.deepStrictEqual(data, {
        id: 'cat',
        worked: true
      })
    })
    it('should fail on a 200 empty response', done => {
      sscope.get('/session/minecraft/hasJoined?username=ausername&serverId=-af59e5b1d5d92e5c2c2776ed0e65e90be181f2a').reply(200)

      yggserver.hasJoined('ausername', 'cat', 'cat', 'cat', (err, data) => {
        assert.ok(err instanceof Error)
        done()
      })
    })
    it('should fail on a 200 empty response (promise)', async () => {
      sscope.get('/session/minecraft/hasJoined?username=ausername&serverId=-af59e5b1d5d92e5c2c2776ed0e65e90be181f2a').reply(200)
      try {
        await yggserver.hasJoined('ausername', 'cat', 'cat', 'cat')
      } catch (e) {
        assert.ok(e instanceof Error)
      }
    })
  })
  afterEach(() => {
    sscope.done()
  })
})
