const assert = require('assert')
const strava = require('../')
const authenticator = require('../lib/authenticator')

describe('config_test', function () {
  describe('#config()', function () {
    it('should accept and use explicit configuration passed to config()', function () {
      strava.config({
        'access_token': 'excdefghi',
        'client_id': 'exlmnopqr',
        'client_secret': 'exuvwxyz',
        'redirect_uri': 'https://sample.com/explicit'
      })

      assert.strictEqual(authenticator.getToken(), 'excdefghi')
      assert.strictEqual(authenticator.getClientId(), 'exlmnopqr')
      assert.strictEqual(authenticator.getClientSecret(), 'exuvwxyz')
      assert.strictEqual(authenticator.getRedirectUri(), 'https://sample.com/explicit')
      authenticator.purge()
    })
  })
})
