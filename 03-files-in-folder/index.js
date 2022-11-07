const fs = require('fs')
const path = require('path')

const folderPath = __dirname + path.sep + 'secret-folder'

fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
  files.forEach((e) => {
    if(e.isDirectory()) {
      return;
    }

    let ext = path.extname(e.name)
    let name = path.basename(e.name, ext)

    fs.stat(folderPath + path.sep + e.name, (err, stats) => {
      console.log(`${name} - ${ext.substr(1)} - ${(stats.size / 1024).toFixed(3)}kb`);
    })
  })
})