const should = require('should')
const authenticator = require('../lib/authenticator')
const querystring = require('querystring')
const strava = require('../')
const nock = require('nock')

describe('oauth_test', function () {
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

      url.should.be.exactly(targetUrl)
    })
  })

  describe('#deauthorize()', function () {
    it('Should have method deauthorize', function () {
      strava.oauth.should.have.property('deauthorize')
    })

    it('Should return 401 with invalid token', function (done) {
      strava.oauth.deauthorize({ access_token: 'BOOM' }, function (err, payload) {
        should(err).be.null()
        should(payload).have.property('message').eql('Authorization Error')
        done()
      })
    })

    it('Should return 401 with invalid token (Promise API)', function () {
      return strava.oauth.deauthorize({ access_token: 'BOOM' })
        .then(function (payload) {
          (payload).should.have.property('message').eql('Authorization Error')
        })
    })
    // Not sure how to test since we don't have a token that we want to deauthorize
  })

  describe('#getToken()', function () {
    before(() => {
      nock('https://www.strava.com')
      // .filteringPath(() => '/oauth/token')
        .post(/^\/oauth\/token/)
      // Match requests where this is true in the query  string
        .query(qs => qs.grant_type === 'authorization_code')
        .reply(200, {
          'token_type': 'Bearer',
          'access_token': '987654321234567898765432123456789',
          'athlete': {},
          'refresh_token': '1234567898765432112345678987654321',
          'expires_at': 1531378346,
          'state': 'STRAVA'
        })
    })

    it('should return an access_token', async () => {
      const payload = await strava.oauth.getToken()
      should(payload).have.property('access_token').eql('987654321234567898765432123456789')
    })
  })

  describe('#refreshToken()', () => {
    before(() => {
      nock('https://www.strava.com')
        .filteringPath(() => '/oauth/token')
        .post(/^\/oauth\/token/)
        .reply(200,
          {
            'access_token': '38c8348fc7f988c39d6f19cf8ffb17ab05322152',
            'expires_at': 1568757689,
            'expires_in': 21432,
            'refresh_token': '583809f59f585bdb5363a4eb2a0ac19562d73f05',
            'token_type': 'Bearer'
          }
        )
    })
    it('should return expected response when refreshing token', () => {
      return strava.oauth.refreshToken('MOCK DOESNT CARE IF THIS IS VALID')
        .then(result => {
          result.should.eql(
            {
              'access_token': '38c8348fc7f988c39d6f19cf8ffb17ab05322152',
              'expires_at': 1568757689,
              'expires_in': 21432,
              'refresh_token': '583809f59f585bdb5363a4eb2a0ac19562d73f05',
              'token_type': 'Bearer'
            }
          )
        })
    })
  })
})
