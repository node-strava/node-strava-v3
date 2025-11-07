const assert = require('assert')
const authenticator = require('../lib/authenticator')

describe('authenticator_test', function () {
  // Store original environment variables
  let originalEnv = {}

  beforeEach(function () {
    // Save original environment variables
    originalEnv = {
      STRAVA_ACCESS_TOKEN: process.env.STRAVA_ACCESS_TOKEN,
      STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
      STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET,
      STRAVA_REDIRECT_URI: process.env.STRAVA_REDIRECT_URI
    }
    // Clear all Strava environment variables to ensure clean state
    delete process.env.STRAVA_ACCESS_TOKEN
    delete process.env.STRAVA_CLIENT_ID
    delete process.env.STRAVA_CLIENT_SECRET
    delete process.env.STRAVA_REDIRECT_URI
    // Clear authenticator cache
    authenticator.purge()
  })

  afterEach(function () {
    // Restore environment variables
    Object.keys(originalEnv).forEach(key => {
      if (originalEnv[key] === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = originalEnv[key]
      }
    })
    // Clear authenticator cache
    authenticator.purge()
  })

  describe('#getToken()', function () {
    it('should read the access token from the env vars', function () {
      process.env.STRAVA_ACCESS_TOKEN = 'abcdefghi'

      assert.strictEqual(authenticator.getToken(), 'abcdefghi')
    })

    it('should return undefined when no token is set', function () {
      // No environment variable set
      assert.strictEqual(authenticator.getToken(), undefined)
    })
  })

  describe('#getClientId()', function () {
    it('should read the client id from the env vars', function () {
      process.env.STRAVA_CLIENT_ID = 'jklmnopqr'

      assert.strictEqual(authenticator.getClientId(), 'jklmnopqr')
    })

    it('should return undefined and log when no client id is set', function () {
      // Capture console.log to verify it's called
      const originalLog = console.log
      let logCalled = false
      console.log = function (msg) {
        if (msg === 'No client id found') {
          logCalled = true
        }
      }

      assert.strictEqual(authenticator.getClientId(), undefined)
      assert.ok(logCalled, 'Should log "No client id found"')

      // Restore console.log
      console.log = originalLog
    })
  })

  describe('#getClientSecret()', function () {
    it('should read the client secret from the env vars', function () {
      process.env.STRAVA_CLIENT_SECRET = 'stuvwxyz'

      assert.strictEqual(authenticator.getClientSecret(), 'stuvwxyz')
    })

    it('should return undefined and log when no client secret is set', function () {
      // Capture console.log to verify it's called
      const originalLog = console.log
      let logCalled = false
      console.log = function (msg) {
        if (msg === 'No client secret found') {
          logCalled = true
        }
      }

      assert.strictEqual(authenticator.getClientSecret(), undefined)
      assert.ok(logCalled, 'Should log "No client secret found"')

      // Restore console.log
      console.log = originalLog
    })
  })

  describe('#getRedirectUri()', function () {
    it('should read the redirect URI from the env vars', function () {
      process.env.STRAVA_REDIRECT_URI = 'https://sample.com'

      assert.strictEqual(authenticator.getRedirectUri(), 'https://sample.com')
    })

    it('should return undefined and log when no redirect URI is set', function () {
      // Capture console.log to verify it's called
      const originalLog = console.log
      let logCalled = false
      console.log = function (msg) {
        if (msg === 'No redirectUri found') {
          logCalled = true
        }
      }

      assert.strictEqual(authenticator.getRedirectUri(), undefined)
      assert.ok(logCalled, 'Should log "No redirectUri found"')

      // Restore console.log
      console.log = originalLog
    })
  })
})
