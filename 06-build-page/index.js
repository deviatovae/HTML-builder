const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
const {copyFile} = require("fs/promises");

async function build() {
    const projectDistPath = __dirname + path.sep + 'project-dist'

    await fsPromises
        .rm(projectDistPath, {recursive: true, force: true})
        .finally(() => fsPromises.mkdir(projectDistPath, {recursive: true}))

    mergeStyles(__dirname + path.sep + 'styles', projectDistPath + path.sep + 'style.css')

    const templatePath = __dirname + path.sep + 'template.html'
    const componentsPath = __dirname + path.sep + 'components'
    buildTemplate(templatePath, componentsPath, projectDistPath + path.sep + 'index.html')

    const scriptDir = __dirname + path.sep
    const sourceDir = scriptDir + 'assets'
    const destDir = scriptDir + 'project-dist' + path.sep + 'assets'
    copyDir(sourceDir, destDir)

}

function mergeStyles(stylesPath, destPath) {
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
                const writeStream = fs.createWriteStream(destPath)

                filesData.forEach((data) => {
                    writeStream.write(data)
                })
            })
        })
}

function buildTemplate(templatePath, componentsPath, destPath) {
    fsPromises.readFile(templatePath).then(async (content) => {
        let htmlTemplate = content.toString()

        fsPromises.readdir(componentsPath).then(async (files) => {
            let promises = []
            for (let file of files) {
                let ext = path.extname(file)
                let name = path.basename(file, ext)
                if (!htmlTemplate.includes(`{{${name}}}`)) {
                    continue
                }
                promises.push(fsPromises
                    .readFile(__dirname + path.sep + 'components' + path.sep + file)
                    .then((content) => {
                        htmlTemplate = htmlTemplate.replace(`{{${name}}}`, content.toString())
                    }))
            }
            return promises
        }).then((promises) => {
            Promise.all(promises).then(() => {
                fsPromises.writeFile(destPath, htmlTemplate)
            })
        })
    })
}

function copyDir(sourceDir, destDir) {
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
}

build()

