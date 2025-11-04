#!/usr/bin/env node
const readline = require('readline')
const fs = require('fs')
const stravaConfig = './data/strava_config'
const stravaConfigTemplate = './strava_config'
const stravaApiUrl = 'https://www.strava.com/settings/api#_=_'

const strava = require('../index.js')

// Parse CLI arguments
function parseArgs() {
  const args = {}
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i].startsWith('--')) {
      const key = process.argv[i].substring(2)
      const value = process.argv[i + 1]
      if (value && !value.startsWith('--')) {
        args[key] = value
        i++
      } else {
        args[key] = true
      }
    }
  }
  return args
}

const argv = parseArgs()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve)
  })
}

async function main() {
  /**
   * Generates the token to access the strava application
   */
  console.log('Before processing, you shall fill your strava config with client id and secret provided by Strava:\n' + stravaApiUrl)

  const clientId = await question('What is your strava client id? ' + (argv['client-id'] ? `[${argv['client-id']}] ` : ''))
  const clientSecret = await question('What is your strava client secret? ' + (argv['client-secret'] ? `[${argv['client-secret']}] ` : ''))

  const finalClientId = clientId || argv['client-id']
  const finalClientSecret = clientSecret || argv['client-secret']

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
  config.client_id = finalClientId
  config.client_secret = finalClientSecret
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

  const code = await question('Enter the code obtained from previous strava url (the code parameter in redirection url): ')

  if (!code) {
    console.log('no code provided')
    rl.close()
    process.exit()
  }

  try {
    const result = await strava.oauth.getToken(code)
    // We update the access token in strava conf file
    if (result.access_token === undefined) throw new Error('Problem with provided code: ' + JSON.stringify(result))
    config.access_token = result.access_token
    fs.writeFileSync(stravaConfig, JSON.stringify(config))
    console.log('Done. Details written to data/strava_config.')
  } catch (error) {
    console.error('Error:', error.message)
  }

  rl.close()
}

main().catch(error => {
  console.error('Error:', error.message)
  rl.close()
  process.exit(1)
})
