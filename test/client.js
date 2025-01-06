/* eslint new-cap: 0 */
require('should')
const { StatusCodeError } = require('../axiosUtility')
const strava = require('../')
const fs = require('fs')

// Synchronously read and parse the configuration file
const file = fs.readFileSync('data/strava_config', 'utf8')
const config = JSON.parse(file)
const token = config.access_token

// Instantiate the client with the access token
const client = new strava.client(token)

describe('client_test', function () {
  // All data fetching methods should work on the client (except Oauth).
  // Try client.athlete.get() as a sample
  describe('#athlete.get()', function () {
    it('Should reject promise with StatusCodeError for non-2xx response', async function (done) {
      const badClient = new strava.client('BOOM')
      try {
        await badClient.athlete.get({})
        // If we make it here, the call didn’t throw, so test fails
        done(new Error('Expected get() to throw StatusCodeError'))
      } catch (e) {
        // Assert that the error is an instance of StatusCodeError
        e.should.be.an.instanceOf(StatusCodeError)
        done()
      }
    })

    it('should return detailed athlete information about athlete associated to access_token (level 3)', async function (done) {
      try {
        const payload = await client.athlete.get({})
        // Assert that the resource_state is exactly 3
        payload.resource_state.should.be.exactly(3)
        done()
      } catch (err) {
        // Log the error and fail the test
        console.error(err)
        done(err)
      }
    })
  })
})
