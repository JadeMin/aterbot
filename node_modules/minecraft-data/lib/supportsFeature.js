const features = {
  pc: require('../minecraft-data/data/pc/common/features.json'),
  bedrock: require('../minecraft-data/data/bedrock/common/features.json')
}

module.exports = (versionObj, allVersions) => {
  // Keep a dictionary of majorVersion => oldest / newest release
  // Relies on descending order in minecraft-data's protocolVersions list
  const newestMajor = allVersions.reduce((acc, cur) => { acc[cur.majorVersion] = acc[cur.majorVersion] || cur; return acc }, {})
  const oldestMajor = allVersions.reduce((acc, cur) => { acc[cur.majorVersion] = cur; return acc }, {})

  function isVersionInRange (minVer, maxVer) {
    if (minVer.endsWith('_major')) {
      minVer = oldestMajor[removeMajorSuffix(minVer)].minecraftVersion
    }
    if (maxVer.endsWith('_major')) {
      maxVer = newestMajor[removeMajorSuffix(maxVer)].minecraftVersion
    } else if (maxVer === 'latest') {
      return versionObj['>='](minVer)
    }

    return versionObj['>='](minVer) && versionObj['<='](maxVer)
  }

  const featureList = features[versionObj.type].map(feature => [feature.name, feature])

  const map = {}
  for (const [featureName, feature] of featureList) {
    if (feature.values) {
      for (const { value, versions, version } of feature.values) { // we're using feature.version
        if (version) {
          if (isVersionInRange(version, version)) map[featureName] = value
        } else {
          if (isVersionInRange(...versions)) map[featureName] = value
        }
      }
    } else {
      const [minVer, maxVer] = feature.versions
      map[featureName] = isVersionInRange(minVer, maxVer)
    }
  }

  return featureName => map[featureName] || false
}

function removeMajorSuffix (verStr) {
  if (!/^\d\.\d+_major$/.test(verStr)) {
    throw new Error(`Not a correct major version value: "${verStr}"`)
  }
  return verStr.replace('_major', '')
}
