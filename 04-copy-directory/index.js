const fs = require('fs')
const path = require('path')
const { copyFile } = require('fs/promises')

const scriptDir = __dirname + path.sep
const sourceDir = scriptDir +  'files'
const destDir = scriptDir + 'files-copy'

fs.promises.rm(destDir, {recursive: true, force: true})
    .then(() => fs.promises.mkdir(destDir, {recursive: true}))
    .then(() => fs.promises.readdir(sourceDir, {withFileTypes: true}))
    .then((files) => {
      files.forEach((file) => {
        if (file.isDirectory()) {
          copyDir(sourceDir + path.sep + file.name, destDir + path.sep + file.name)
        } else {
          copyFile(sourceDir + path.sep + file.name, destDir + path.sep + file.name)
        }
      })
    })

