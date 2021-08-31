#!/usr/bin/env node
const inquirer = require('inquirer')
const fs = require('fs')
const argv = require('yargs').argv
const stravaConfig = './data/strava_config'
const stravaConfigTemplate = './strava_config'
const stravaApiUrl = 'https://www.strava.com/settings/api#_=_'

const strava = require('../index.js')

/**
 * Generates the token to access the strava application
 */
console.log('Before processing, you shall fill your strava config with client id and secret provided by Strava:\n' + stravaApiUrl)

inquirer
  .prompt(
    [
      {
        type: 'input',
        name: 'clientId',
        message: 'What is your strava client id?',
        default: argv['client-id']
      },
      {
        type: 'input',
        name: 'clientSecret',
        message: 'What is your strava client secret?',
        default: argv['client-secret']
      }
    ])
  .then(function (answers) {
    // We copy the strava config file
    try {
      fs.mkdirSync('data')
    } catch (e) {
      // nothing
    }

    var content = fs.readFileSync(stravaConfigTemplate)
    fs.writeFileSync(stravaConfig, content)

    // We open the default config file and inject the client_id and client secret
    // Without these informations in the config file the getRequestAccessURL would fail
    content = fs.readFileSync(stravaConfig)
    var config = JSON.parse(content)
    config.client_id = answers.clientId
    config.client_secret = answers.clientSecret
    config.access_token = 'to define'
    // You may need to make your callback URL
    // at Strava /settings/api temporarily match this
    config.redirect_uri = 'http://localhost'

    // We update the config file
    fs.writeFileSync(stravaConfig, JSON.stringify(config))

    // Generates the url to have full access
    var url = strava.oauth.getRequestAccessURL({
      scope: 'activity:write,profile:write,read_all,profile:read_all,activity:read_all'
    })
    // We have to grab the code manually in the browser and then copy/paste it into strava_config as "access_token"
    console.log('Connect to the following url and copy the code: ' + url)

    inquirer.prompt(
      [
        {
          type: 'input',
          name: 'code',
          message: 'Enter the code obtained from previous strava url (the code parameter in redirection url)'
        }
      ])
      .then(function (answers2) {
        if (!answers2.code) {
          console.log('no code provided')
          process.exit()
        }
        strava.oauth.getToken(answers2.code).then(result => {
          // We update the access token in strava conf file
          if (result.access_token === undefined) throw new Error('Problem with provided code: ' + JSON.stringify(result))
          config.access_token = result.access_token
          fs.writeFileSync(stravaConfig, JSON.stringify(config))
        })
      })
      .then(done => console.log('Done. Details written to data/strava_config.'))
  })
