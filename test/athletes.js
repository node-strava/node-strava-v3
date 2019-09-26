const should = require('should')
var strava = require('../')
var testHelper = require('./_helper')

var _sampleAthlete

describe('athletes', function () {
  // get the athlete so we have access to an id for testing
  before(function (done) {
    testHelper.getSampleAthlete(function (err, payload) {
      should(err).be.null()
      _sampleAthlete = payload
      done()
    })
  })

  describe('#get()', function () {
    it('should return basic athlete information (level 2)', function (done) {
      strava.athletes.get({ id: _sampleAthlete.id }, function (err, payload) {
        if (!err) {
          // console.log(payload);
          (payload.resource_state).should.be.within(2, 3)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })
})

describe('#stats()', function () {
  it('should return athlete stats information', function (done) {
    strava.athletes.stats({ id: _sampleAthlete.id }, function (err, payload) {
      if (!err) {
        payload.should.have.property('biggest_ride_distance')
      } else {
        console.log(err)
      }

      done()
    })
  })
})
