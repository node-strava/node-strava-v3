var should = require('should')
var strava = require('../')
var testHelper = require('./_helper')

var _sampleRoute

describe('routes_test', function () {
  before(function (done) {
    testHelper.getSampleRoute(function (err, sampleRoute) {
      if (err) { return done(err) }

      _sampleRoute = sampleRoute
      done()
    })
  })

  describe('#get()', function () {
    it('should return information about the corresponding route', function (done) {
      strava.routes.get({ id: _sampleRoute.id }, function (err, payload) {
        if (!err) {
          should(payload.resource_state).be.exactly(3)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })
})
