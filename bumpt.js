#!/usr/bin/env node

'use strict'

var childProcess = require('child_process')
  , fs = require('fs')
  , packageJson = JSON.parse(fs.readFileSync('./package.json'))
  , version = packageJson.version
  , parts = version.split('.')
  , last = +parts[parts.length - 1]
  , bumped = last + 1
  , nextParts = parts.slice(0, parts.length - 1).concat(bumped)
  , nextVersion = nextParts.join('.')

if(isNaN(bumped)) {
  console.error('Failed to parse version: ' + version)
  return
}

packageJson.version = nextVersion
console.log('writing package.json')
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, '  '))

run('git add package.json')
run('git commit -m "Bump version to ' + nextVersion + '"')
run('git tag ' + nextVersion)
run('git push origin ' + nextVersion)
run('git push origin HEAD')
run('npm publish')

function run(cmd) {
  console.log('$', cmd)
  childProcess.execSync(cmd)
}