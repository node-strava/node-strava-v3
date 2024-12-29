require('should')
var mockFS = require('mock-fs')
var envRestorer = require('env-restorer')
var authenticator = require('../lib/authenticator')

// Restore File system mocks, authentication state and environment variables
var restoreAll = function () {
  mockFS.restore()
  authenticator.purge()
  envRestorer.restore()
}

describe('authenticator_test', function () {
  describe('#getToken()', function () {
    it('should read the access token from the config file', async function () {
      mockFS({
        'data/strava_config': JSON.stringify({
          'access_token': 'abcdefghi',
          'client_id': 'jklmnopqr',
          'client_secret': 'stuvwxyz',
          'redirect_uri': 'https://sample.com'
        })
      })
      delete process.env.STRAVA_ACCESS_TOKEN
      authenticator.purge()

      const token = await authenticator.getToken()
      token.should.be.exactly('abcdefghi')
    })

    it('should read the access token from the env vars', async function () {
      mockFS({
        'data': {}
      })
      process.env.STRAVA_ACCESS_TOKEN = 'abcdefghi'
      authenticator.purge()

      const token = await authenticator.getToken()
      token.should.be.exactly('abcdefghi')
    })

    afterEach(restoreAll)
  })

  describe('#getClientId()', function () {
    it('should read the client id from the config file', async function () {
      mockFS({
        'data/strava_config': JSON.stringify({
          'access_token': 'abcdefghi',
          'client_id': 'jklmnopqr',
          'client_secret': 'stuvwxyz',
          'redirect_uri': 'https://sample.com'
        })
      })
      delete process.env.STRAVA_CLIENT_ID
      authenticator.purge()

      const clientId = await authenticator.getClientId()
      clientId.should.be.exactly('jklmnopqr')
    })

    it('should read the client id from the env vars', async function () {
      mockFS({
        'data': {}
      })
      process.env.STRAVA_CLIENT_ID = 'abcdefghi'
      authenticator.purge()

      const clientId = await authenticator.getClientId()
      clientId.should.be.exactly('abcdefghi')
    })

    afterEach(restoreAll)
  })

  describe('#getClientSecret()', function () {
    it('should read the client secret from the config file', async function () {
      mockFS({
        'data/strava_config': JSON.stringify({
          'access_token': 'abcdefghi',
          'client_id': 'jklmnopqr',
          'client_secret': 'stuvwxyz',
          'redirect_uri': 'https://sample.com'
        })
      })
      delete process.env.STRAVA_CLIENT_SECRET
      authenticator.purge()

      const clientSecret = await authenticator.getClientSecret()
      clientSecret.should.be.exactly('stuvwxyz')
    })

    it('should read the client secret from the env vars', async function () {
      mockFS({
        'data': {}
      })
      process.env.STRAVA_CLIENT_SECRET = 'abcdefghi'
      authenticator.purge()

      const clientSecret = await authenticator.getClientSecret()
      clientSecret.should.be.exactly('abcdefghi')
    })
    afterEach(restoreAll)
  })

  describe('#getRedirectUri()', function () {
    it('should read the redirect URI from the config file', async function () {
      mockFS({
        'data/strava_config': JSON.stringify({
          'access_token': 'abcdefghi',
          'client_id': 'jklmnopqr',
          'client_secret': 'stuvwxyz',
          'redirect_uri': 'https://sample.com'
        })
      })
      delete process.env.STRAVA_REDIRECT_URI
      authenticator.purge()

      const redirectUri = await authenticator.getRedirectUri()
      redirectUri.should.be.exactly('https://sample.com')
    })

    it('should read the redirect URI from the env vars', async function () {
      mockFS({
        'data': {}
      })
      process.env.STRAVA_REDIRECT_URI = 'https://sample.com'
      authenticator.purge()

      const redirectUri = await authenticator.getRedirectUri()
      redirectUri.should.be.exactly('https://sample.com')
    })

    afterEach(restoreAll)
  })
})
