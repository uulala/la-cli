const fse = require('fs-extra')
const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols')
const inquirer = require('inquirer')
const handlebars = require('handlebars')
const path = require('path')

const dlTemplate = require('./download')

async function initProject(projectName) {
    try {
        const exists = await fse.pathExists(projectName)
        if (exists) {
            console.log(symbols.error, chalk.red('The project already exists.'))
        } else {
            inquirer.prompt([{
                type: 'input',
                name: 'name',
                message: 'Set a global name for project',
                default: 'Default'
            },
            {
                type: 'input', // 类型，其他类型看官方文档
                name: 'theme', // 名称，用来索引当前 name 的值
                message: 'Pick a theme?',
                default: 'Default', // 默认值，用户不输入时用此值
            },]).then(async (answers) => {
                const initSpinner = ora(chalk.cyan('Initialzing project...'))
                initSpinner.start()
                const tempatePath = path.resolve(__dirname, '../template/')
                const processPath = process.cwd() // 回 Node.js 进程的当前工作目录
                const LCProjectName = projectName.toLowerCase()

                const targetPath = `${processPath}/${LCProjectName}`

                const exists = await fse.pathExists(tempatePath)
                if (!exists) {
                    await dlTemplate()
                }

                try {
                    await fse.copy(tempatePath, targetPath)
                } catch (err) {
                    console.log(symbols.error, chalk.red(`Copy template failed. ${err}`))
                    process.exit()
                }

                const multiMeta = {
                    project_name: LCProjectName,
                    global_name: answers.name
                }

                const multiFiles = [
                    `${targetPath}/package.json`,
                    `${targetPath}/gulpfile.js`,
                    `${targetPath}/test/index.html`,
                    `${targetPath}/src/index.js`
                ]

                for (var i = 0; i < multiFiles.length; i++) {
                    try {
                        const multiFilesContent = await fse.readFile(multiFiles[i], 'utf8')
                        const multiFileResult = await handlebars.compile(multiFilesContent)(multiMeta)
                        await fse.outputFile(multiFiles[i], multiFileResult)
                    } catch (err) {
                        initSpinner.text = chalk.red(`Initialize project failed. ${err}`)
                        initSpinner.fail()
                        process.exit()
                    }
                }
                initSpinner.text = 'Initialize project successful.'
                initSpinner.succeed()
                console.log(`
                To get started: 

                    cd ${chalk.yellow(LCProjectName)}
                    ${chalk.yellow('npm install')} or ${chalk.yellow('yarn install')}
                    ${chalk.yellow('npm run dev')} or ${chalk.yellow('yarn run dev')}
                `)
            }).catch(err => {
                if (err.isTtyError) {
                    console.log(symbols.error, chalk.red("Prompt couldn't be rendered in the current environment."))
                } else {
                    console.log(symbols.error, chalk.red(err))
                }
            })
        }
    } catch (err) {
        console.error(err)
        process.exit()
    }
}

module.exports = initProject