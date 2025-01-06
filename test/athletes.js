const should = require('should')
var strava = require('../')
var testHelper = require('./_helper')

var _sampleAthlete

describe('athletes', function () {
  // Get the athlete so we have access to an id for testing
  before(async function (done) {
    try {
      const payload = await testHelper.getSampleAthlete()
      should(payload).not.be.null()
      _sampleAthlete = payload
      done()
    } catch (err) {
      done(err)
    }
  })

  describe('#get()', function () {
    it('should return basic athlete information (level 2)', async function (done) {
      try {
        const payload = await strava.athletes.get({ id: _sampleAthlete.id })
        payload.resource_state.should.be.within(2, 3)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })
})

describe('#stats()', function () {
  it('should return athlete stats information', async function (done) {
    try {
      const payload = await strava.athletes.stats({ id: _sampleAthlete.id })
      payload.should.have.property('biggest_ride_distance')
      done()
    } catch (err) {
      console.log(err)
      done(err)
    }
  })
})
