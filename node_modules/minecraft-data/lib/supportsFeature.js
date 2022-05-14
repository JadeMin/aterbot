const features = require('../minecraft-data/data/pc/common/features.json')
const nameToFeature = Object.fromEntries(features.map(feature => [feature.name, feature]))

function isFeatureInRange (featureName, versionObj) {
  const feature = nameToFeature[featureName]
  if (feature === undefined) {
    throw new Error(`Feature ${feature} doesn't exist`)
  }

  if (feature.values) {
    for (const { value, versions, version } of feature.values) { // we're using feature.version
      if (version) {
        const ver = version.replace('_major', '')
        if (!/^\d\.\d+$/.test(ver)) {
          throw new Error(`Not a correct major version value, instead the version is: "${version}"`)
        }
        if (versionObj.majorVersion === ver) {
          return value
        }
      } else { // we're using feature.versions
        const [minVer, maxVer] = versions
        if (isVersionInRange(minVer, versionObj, maxVer)) {
          return value
        }
      }
    }
    return null // if we didn't match anything, return null
  } else {
    const [minVer, maxVer] = feature.versions
    return isVersionInRange(minVer, versionObj, maxVer)
  }
}

function isVersionInRange (minVer, versionObj, maxVer) {
  let inRange = true
  const { majorVersion } = versionObj
  if (minVer.endsWith('_major')) {
    const ver = removeMajorSuffix(minVer)
    inRange = inRange && getVersionObj(majorVersion)['>='](ver)
  } else {
    inRange = inRange && versionObj['>='](minVer)
  }
  if (maxVer === 'latest') { // no need to check upper bound if upperbound is latest
    return inRange
  }
  if (maxVer.endsWith('_major')) {
    const ver = removeMajorSuffix(maxVer)
    inRange = inRange && getVersionObj(majorVersion)['<='](ver)
  } else {
    inRange = inRange && versionObj['<='](maxVer)
  }
  return inRange
}

function removeMajorSuffix (verStr) {
  return verStr.replace('_major', '')
}

function getVersionObj (ver) {
  return require('minecraft-data')(ver).version
}

module.exports = isFeatureInRange
