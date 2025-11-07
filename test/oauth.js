const assert = require('assert')
const authenticator = require('../lib/authenticator')
const querystring = require('querystring')
const strava = require('../')
const nock = require('nock')
const testHelper = require('./_helper')

describe('oauth_test', function () {
  beforeEach(function () {
    nock.cleanAll()
    testHelper.setupMockAuth()
  })

  afterEach(function () {
    nock.cleanAll()
    testHelper.cleanupAuth()
  })

  describe('#getRequestAccessURL()', function () {
    it('should return the full request access url', function () {
      const targetUrl = 'https://www.strava.com/oauth/authorize?' +
        querystring.stringify({
          client_id: authenticator.getClientId(),
          redirect_uri: authenticator.getRedirectUri(),
          response_type: 'code',
          scope: 'view_private,write'
        })

      const url = strava.oauth.getRequestAccessURL({
        scope: 'view_private,write'
      })

      assert.strictEqual(url, targetUrl)
    })
  })

  describe('#deauthorize()', function () {
    it('Should have method deauthorize', function () {
      assert.ok(typeof strava.oauth.deauthorize === 'function')
    })

    it('Should return 401 with invalid token', async function () {
      nock('https://www.strava.com')
        .post('/oauth/deauthorize')
        .once()
        .reply(401, {
          message: 'Authorization Error'
        })

      const payload = await strava.oauth.deauthorize({ access_token: 'BOOM' })
      assert.ok(payload)
      assert.strictEqual(payload.message, 'Authorization Error')
    })
  })

  describe('#getToken()', function () {
    it('should return an access_token', async function () {
      nock('https://www.strava.com')
        .post(/^\/oauth\/token/)
        .query(qs => qs.grant_type === 'authorization_code')
        .once()
        .reply(200, {
          'token_type': 'Bearer',
          'access_token': '987654321234567898765432123456789',
          'athlete': {},
          'refresh_token': '1234567898765432112345678987654321',
          'expires_at': 1531378346,
          'state': 'STRAVA'
        })

      const payload = await strava.oauth.getToken()
      assert.ok(payload)
      assert.strictEqual(payload.access_token, '987654321234567898765432123456789')
    })
  })

  describe('#refreshToken()', function () {
    it('should return expected response when refreshing token', async function () {
      nock('https://www.strava.com')
        .post(/^\/oauth\/token/)
        .once()
        .reply(200, {
          'access_token': '38c8348fc7f988c39d6f19cf8ffb17ab05322152',
          'expires_at': 1568757689,
          'expires_in': 21432,
          'refresh_token': '583809f59f585bdb5363a4eb2a0ac19562d73f05',
          'token_type': 'Bearer'
        })

      const result = await strava.oauth.refreshToken('MOCK DOESNT CARE IF THIS IS VALID')
      assert.deepStrictEqual(result, {
        'access_token': '38c8348fc7f988c39d6f19cf8ffb17ab05322152',
        'expires_at': 1568757689,
        'expires_in': 21432,
        'refresh_token': '583809f59f585bdb5363a4eb2a0ac19562d73f05',
        'token_type': 'Bearer'
      })
    })
  })
})
