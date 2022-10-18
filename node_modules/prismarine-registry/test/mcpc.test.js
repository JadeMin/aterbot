/* eslint-env mocha */

const SUPPORTED_VERSIONS = ['1.15.2', '1.16', '1.17.1', '1.18', '1.19']
const test = require('./mcpc')

describe('mcpc', function () {
  this.timeout(9000 * 10)

  for (const version of SUPPORTED_VERSIONS) {
    it('works on ' + version, () => test(version))
  }
})
