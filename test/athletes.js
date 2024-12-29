const should = require('should')
var strava = require('../')
var testHelper = require('./_helper')

var _sampleAthlete

describe('athletes', function () {
  // Get the athlete so we have access to an id for testing
  before(function (done) {
    testHelper.getSampleAthlete()
      .then(function (payload) {
        should(payload).not.be.null()
        _sampleAthlete = payload
        done()
      })
      .catch(done)
  })

  describe('#get()', function () {
    it('should return basic athlete information (level 2)', function (done) {
      strava.athletes.get({ id: _sampleAthlete.id })
        .then(function (payload) {
          payload.resource_state.should.be.within(2, 3)
          done()
        })
        .catch(function (err) {
          console.log(err)
          done(err)
        })
    })
  })
})

describe('#stats()', function () {
  it('should return athlete stats information', function (done) {
    strava.athletes.stats({ id: _sampleAthlete.id })
      .then(function (payload) {
        payload.should.have.property('biggest_ride_distance')
        done()
      })
      .catch(function (err) {
        console.log(err)
        done(err)
      })
  })
})
