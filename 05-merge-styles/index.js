const fs = require('fs')
const path = require('path')

const stylesPath = __dirname + path.sep + 'styles'

fs.promises.readdir(stylesPath, {withFileTypes: true})
  .then((files) => {
    let readFilePromises = []

    files.forEach((e) => {
      let ext = path.extname(e.name)
      if (e.isDirectory() || ext !== '.css') {
        return;
      }
      let promise = fs.promises.readFile(stylesPath + path.sep + e.name)
      readFilePromises.push(promise)
    })

    Promise.all(readFilePromises).then((filesData) => {
      const bundleFilePath = __dirname + path.sep + 'project-dist' + path.sep + 'bundle.css'
      const writeStream = fs.createWriteStream(bundleFilePath)

      filesData.forEach((data) => {
        writeStream.write(data)
      })
    })
  })