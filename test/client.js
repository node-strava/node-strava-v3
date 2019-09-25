/* eslint new-cap: 0 */
require('should')
var errors = require('request-promise/errors')
var strava = require('../')
var file = require('fs').readFileSync('data/strava_config', 'utf8')
var config = JSON.parse(file)
var token = config.access_token

// Test the "client" API that is based on providing an explicit per-instance access_token
// Rather than the original global-singleton configuration design.

var client = new strava.client(token)

describe('client_test', function () {
  // All data fetching methods should work on the client (except Oauth).
  // Try client.athlete.get() as a sample
  describe('#athlete.get()', function () {
    it('Should reject promise with StatusCodeError for non-2xx response', function (done) {
      var badClient = new strava.client('BOOM')
      badClient.athlete.get({})
        .catch(errors.StatusCodeError, function (e) {
          done()
        })
    })

    it('Callback interface should return StatusCodeError for non-2xx response', function (done) {
      var badClient = new strava.client('BOOM')
      badClient.athlete.get({}, function (err, payload) {
        err.should.be.an.instanceOf(errors.StatusCodeError)
        done()
      })
    })

    it('should return detailed athlete information about athlete associated to access_token (level 3)', function (done) {
      client.athlete.get({}, function (err, payload) {
        if (!err) {
          (payload.resource_state).should.be.exactly(3)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })
})
