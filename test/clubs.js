require('should')
var strava = require('../')
var testHelper = require('./_helper')

var _sampleClub

describe('clubs_test', function () {
  before(async function (done) {
    try {
      const payload = await testHelper.getSampleClub()
      _sampleClub = payload
      done()
    } catch (err) {
      done(err)
    }
  })

  describe('#get()', function () {
    it('should return club detailed information', async function (done) {
      try {
        const payload = await strava.clubs.get({ id: _sampleClub.id })
        payload.resource_state.should.be.exactly(3)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })

  describe('#listMembers()', function () {
    it('should return a summary list of athletes in club', async function (done) {
      try {
        const payload = await strava.clubs.listMembers({ id: _sampleClub.id })
        payload.should.be.instanceof(Array)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })

  describe('#listActivities()', function () {
    it('should return a list of club activities', async function (done) {
      try {
        const payload = await strava.clubs.listActivities({ id: _sampleClub.id })
        payload.should.be.instanceof(Array)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })
})
