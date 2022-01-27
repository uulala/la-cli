const { json } = require('express/lib/response')
const fse = require('fs-extra')
const path = require('path')

const jsonConfig = {
    "name": "la",
    "mirror": "https://github.com/uulala/my-app.git"
}

const configPath = path.resolve(__dirname, '../config.json')

async function defConfig() {
    try {
        await fse.outputJSON(configPath, jsonConfig)
    } catch (err) {
        console.log(err)
        process.exit()
    }
}

module.exports = defConfig