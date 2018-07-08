#!/usr/bin/env node

let shell = require('shelljs')
let colors = require('colors')
let fs = require('fs')
let emoji = require('console-emoji')

let scaffolds = require('./scaffolds/scaffolds.js')
let dirs = require('./scaffolds/dirs.js')

let appName = process.argv[2]
let appDirectory = `${process.cwd()}/${appName}`
let subject = process
  .argv[3]
  .toLowerCase()

const run = async() => {
  if (subject) {
    await createFolders()
    console.log('All done ...'.green)
  } else {
    let success = await createReactApp()
    if (!success) {
      console.log('Failure while running create-react-app'.red)
      console.log('Aborting ...'.red)
      return false;
    }
    await cdIntoNewApp()
    await installPackages()
    await template()
    console.log("Party's over folks! Get back to work.".purple)
    console.log("\nTo create a new container do: ")
    console.log("\nlespare scaffold ".green, "container-name\n".cyan)
  }
}

const createReactApp = () => {
  return new Promise(resolve => {
    if (appName) {
      shell.exec(`create-react-app ${appName}`, (code) => {
        console.log("Exited with code ", code)
        emoji('success ...', 'ok')
        console.log("Created react app. Let's party!!".yellow)
        emoji('Good to go :clap::clap::clap:', 'green')
        resolve(true)
      })
    } else {
      console.log("\nNo party! No app name was provided.".red)
      console.log("\nProvide an app name in the following format: ")
      console.log("\nlespare new".green, "app-name\n".cyan)
      emoji('Why you not love me ... :cry:', 'yellow')
      resolve(false)
    }
  })
}

const cdIntoNewApp = () => {
  return new Promise(resolve => {
    shell.cd(appDirectory)
    resolve()
  })
}

const installPackages = () => {
  return new Promise(resolve => {
    console.log(("\nInstalling redux, react-router, react-router-dom, react-redux, and redux-thun" +
        "\n").cyan)
    shell.exec(`npm install redux react-router react-redux redux-thunk react-router-dom`, () => {
      console.log("\nFinished installing packages\n".green)
      resolve()
    })
  })
}

const template = () => {
  return new Promise(resolve => {
    let promises = []
    Object
      .keys(scaffolds)
      .forEach((fileName, i) => {
        promises[i] = new Promise(res => {
          fs
            .writeFile(`${appDirectory}/src/${fileName}`, scaffolds[fileName], function (err) {
              if (err) {
                return console.log(err)
              }
              res()
            })
        })
      })
    Promise
      .all(promises)
      .then(() => {
        resolve()
      })
  })
}

const createFolders = () => {
  Object
    .keys(dirs)
    .forEach((targetName, i) => {
      dir = targetName.substring(0, targetName.length - 3)
      shell.exec(`mkdir src/${dir}`, () => {
        console.log(`${dir}`, "created".green)
      })
      shell.exec(`touch src/${dir}/${subject}${targetName}`, () => {
        console.log(`${subject}${targetName}`, "created".green)
      })
      fs.writeFile(`src/${dir}/${subject}${targetName}`, dirs[targetName], function (err) {
        if (err) {
          return console.log(err)
        }
      })
    })

}

run()
