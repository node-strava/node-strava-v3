require('should')
var strava = require('../')
var testHelper = require('./_helper')

var _sampleGear

describe('gear_test', function () {
  before(function (done) {
    testHelper.getSampleGear()
      .then(function (payload) {
        _sampleGear = payload

        if (!_sampleGear || !_sampleGear.id) {
          return done(new Error('At least one piece of gear posted to Strava is required for testing.'))
        }

        done()
      })
      .catch(done)
  })

  describe('#get()', function () {
    it('should return detailed athlete information about gear (level 3)', function (done) {
      strava.gear.get({ id: _sampleGear.id })
        .then(function (payload) {
          payload.resource_state.should.be.exactly(3)
          done()
        })
        .catch(function (err) {
          console.log(err)
          done(err)
        })
    })
  })
})
