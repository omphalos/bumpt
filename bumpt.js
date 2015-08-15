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
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, '  '))

var commands = [
  'git add package.json',
  'git commit -m "Bump version to ' + nextVersion + '"',
  'git tag ' + nextVersion,
  'git push origin HEAD',
  'git push origin ' + version,
  'npm publish'
]

;(function runNext() {
  if(!commands.length) return console.log('Bumped to version ' + nextVersion)
  childProcess.exec(commands.shift(), function(ex, out, err) {
    if(err) console.error(err)
    console.log(out)
    if(ex) throw ex
    runNext()
  })
})()
