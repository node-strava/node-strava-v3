/* eslint new-cap: 0 */
const should = require('should')
const nock = require('nock')
const { StatusCodeError } = require('../axiosUtility')
const strava = require('../')

// Use explicit tokens rather than reading from a file
const GOOD_TOKEN = 'good-test-token'
const BAD_TOKEN = 'bad-test-token'

describe('client_test', function () {
  afterEach(() => {
    // Clean up after each test
    nock.cleanAll()
  })

  // All data fetching methods should work on the client (except OAuth).
  // Try client.athlete.get() as a sample
  describe('#athlete.get()', function () {
    it('Should reject promise with StatusCodeError for non-2xx response', async function () {
      // Mock athlete endpoint for BAD token -> 401
      nock('https://www.strava.com')
        .get('/api/v3/athlete')
        .matchHeader('authorization', 'Bearer ' + BAD_TOKEN)
        .reply(401, { message: 'Authorization Error', errors: [{ resource: 'Application', code: 'invalid' }] })

      const badClient = new strava.client(BAD_TOKEN)
      try {
        await badClient.athlete.get({})
      } catch (err) {
        should(err).be.instanceOf(StatusCodeError)
        should(err.statusCode).equal(401)
      }
    })

    it('should return detailed athlete information about athlete associated to access_token', function () {
      // Mock athlete endpoint for GOOD token -> 200
      nock('https://www.strava.com')
        .get('/api/v3/athlete')
        .matchHeader('authorization', 'Bearer ' + GOOD_TOKEN)
        .reply(200, {
          resource_state: 3,
          id: 12345,
          firstname: 'Test',
          lastname: 'User'
        })

      const client = new strava.client(GOOD_TOKEN)
      return client.athlete.get({})
        .then((payload) => {
          should(payload).be.ok()
          should(payload.resource_state).equal(3)
          should(payload.id).equal(12345)
        })
    })

    it('Should reject promise with StatusCodeError when using bad token', async function () {
      // Mock athlete endpoint for BAD token -> 401
      // Testing with a second interceptor to ensure nock works correctly
      nock('https://www.strava.com')
        .get('/api/v3/athlete')
        .matchHeader('authorization', 'Bearer ' + BAD_TOKEN)
        .reply(401, { message: 'Authorization Error' })

      const badClient = new strava.client(BAD_TOKEN)
      try {
        await badClient.athlete.get({})
      } catch (err) {
        should(err).be.instanceOf(StatusCodeError)
        should(err.statusCode).equal(401)
        should(err.data.message).equal('Authorization Error')
      }
    })

    it('Should successfully return athlete data with valid token', function () {
      // Mock athlete endpoint for GOOD token -> 200
      // Testing a second successful request to verify client instances work correctly
      nock('https://www.strava.com')
        .get('/api/v3/athlete')
        .matchHeader('authorization', 'Bearer ' + GOOD_TOKEN)
        .reply(200, {
          resource_state: 3,
          id: 67890,
          firstname: 'Another',
          lastname: 'Athlete'
        })

      const client = new strava.client(GOOD_TOKEN)
      return client.athlete.get({})
        .then((payload) => {
          should(payload).be.ok()
          should(payload.resource_state).equal(3)
          should(payload.id).equal(67890)
          should(payload.firstname).equal('Another')
        })
    })
  })
})
