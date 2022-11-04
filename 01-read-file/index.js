const fs = require('fs')
const path = require('path')

const readStream = fs.createReadStream(__dirname + path.sep + "text.txt")

readStream.on('data', (buffer) => {
  process.stdout.write(buffer)
})