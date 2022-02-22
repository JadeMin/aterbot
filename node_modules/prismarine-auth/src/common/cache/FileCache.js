const fs = require('fs')

class FileCache {
  constructor (cacheLocation) {
    this.cacheLocation = cacheLocation
  }

  async loadInitialValue () {
    try {
      return JSON.parse(fs.readFileSync(this.cacheLocation, 'utf8'))
    } catch (e) {
      const cached = {}
      fs.writeFileSync(this.cacheLocation, JSON.stringify(cached))
      return cached
    }
  }

  async getCached () {
    if (this.cache === undefined) {
      this.cache = await this.loadInitialValue()
    }

    return this.cache
  }

  async setCached (cached) {
    this.cache = cached
    fs.writeFileSync(this.cacheLocation, JSON.stringify(this.cache))
  }

  async setCachedPartial (cached) {
    await this.setCached({
      ...this.cache,
      ...cached
    })
  }
}

module.exports = FileCache
