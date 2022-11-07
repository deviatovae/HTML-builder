const fs = require('fs')
const path = require('path')
const readline = require('readline')

const writeStream = fs.createWriteStream(__dirname + path.sep + 'text.txt')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})


rl.write('Hello, enter your text!' + "\n\n")

rl.on('line', (text) => {
  if (text === 'exit') {
    rl.close()
    writeStream.close()
  } else {
    writeStream.write(text + "\n")
  }
})
function onExit () {
  console.log('That\'s it. Goodbye!')
  writeStream.close()
}
process.on('exit', onExit)
process.on('SIGINT', onExit)