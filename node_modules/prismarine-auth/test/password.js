/* eslint-env mocha */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const { expect } = chai

const { Authflow } = require('../')

describe('password authentication', async () => {
  it('should fail if not given a valid password', async () => {
    const flow = new Authflow('this.is.not@valid.email.lol', './test', { password: 'sdfasdfas', authTitle: false })
    await expect(flow.getXboxToken()).to.eventually.be.rejectedWith('Invalid credentials')
  })
})
