const fs = require('fs')
const path = require('path')
const { copyFile } = require('fs/promises')

const scriptDir = __dirname + path.sep
const sourceDir = scriptDir +  'files'
const destDir = scriptDir + 'files-copy'

fs.promises.mkdir(destDir, { recursive: true })
  .then((dirName) => {
    return fs.promises.readdir(sourceDir)
  }).then((files) => {
  files.forEach((file) => {
    return copyFile(sourceDir + path.sep + file, destDir + path.sep + file)
  })
  fs.promises.readdir(destDir).then((copiedFiles) => {
    copiedFiles.forEach((copiedFile) => {
      if(!files.includes(copiedFile)){
        return fs.promises.rm(destDir + path.sep + copiedFile)
      }
    })
  })
})

