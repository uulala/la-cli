#!/usr/bin/env node

const program = require('commander')

program.version(require('../package.json').version, '-v, --version')


const updateChk = require('../lib/update')
program.command('upgrade').description('Check the la version.').action(() => { updateChk() })


const setMirror = require('../lib/mirror')
program.command('mirror <template_mirror>').description('Set the template mirror.').action((tplMirror) => { setMirror(tplMirror) })

const dlTemplate = require('../lib/download')
program.command('template').description('Download template from mirror.').action(() => { dlTemplate() })

const initProject = require('../lib/init')
program.name('la').usage('<command> [options]').command('init <project_name>').description('Create a la project.').action(project => { initProject(project) })

program.parse(process.argv)

