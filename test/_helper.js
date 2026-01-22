const strava = require('../')
const authenticator = require('../lib/authenticator')

var testsHelper = {}

testsHelper.setupMockAuth = function () {
  strava.config({
    access_token: 'test_token',
    client_id: 'test_id',
    client_secret: 'test_secret',
    redirect_uri: 'http://localhost'
  })
}

testsHelper.cleanupAuth = function () {
  authenticator.purge()
}

module.exports = testsHelper
