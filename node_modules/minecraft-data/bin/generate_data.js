#!/usr/bin/env node

const dataSource = require('../minecraft-data/data/dataPaths')
const fs = require('fs')
const path = require('path')

const data = 'module.exports =\n{\n' + Object
  .keys(dataSource)
  .map(k1 =>
    "  '" + k1 + "': {\n" + Object
      .keys(dataSource[k1])
      .map(k2 =>
        "    '" + k2 + "': {" + '\n' + Object
          .keys(dataSource[k1][k2])
          .map(k3 => {
            const loc = `minecraft-data/data/${dataSource[k1][k2][k3]}/`
            try {
              // Check if the file can be loaded as JSON
              require('../' + loc + k3 + '.json')
              return `      get ${k3} () { return require("./${loc}${k3}.json") }`
            } catch {
              // No ? Return it as a URL path so other code can decide how to handle it
              const file = fs.readdirSync(path.join(__dirname, '../', loc)).find(f => f.startsWith(k3 + '.'))
              if (file) { return `      ${k3}: __dirname + '/${loc}${file}'` } else { throw Error('file not found: ' + loc + k3) }
            }
          })
          .join(',\n') +
      '\n    }'
      )
      .join(',\n') +
    '\n  }'
  )
  .join(',\n') + '\n}\n'

fs.writeFileSync(path.join(__dirname, '/../data.js'), data)
