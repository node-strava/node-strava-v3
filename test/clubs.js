require('should')
var strava = require('../')
var testHelper = require('./_helper')

var _sampleClub

describe('clubs_test', function () {
  before(function (done) {
    testHelper.getSampleClub(function (err, payload) {
      if (err) { return done(err) }

      _sampleClub = payload
      done()
    })
  })

  describe('#get()', function () {
    it('should return club detailed information', function (done) {
      strava.clubs.get({ id: _sampleClub.id }, function (err, payload) {
        if (!err) {
          (payload.resource_state).should.be.exactly(3)
        } else {
          console.log(err)
        }
        done()
      })
    })
  })

  describe('#listMembers()', function () {
    it('should return a summary list of athletes in club', function (done) {
      strava.clubs.listMembers({ id: _sampleClub.id }, function (err, payload) {
        if (!err) {
          payload.should.be.instanceof(Array)
        } else {
          console.log(err)
        }
        done()
      })
    })
  })

  describe('#listActivities()', function () {
    it('should return a list of club activities', function (done) {
      strava.clubs.listActivities({ id: _sampleClub.id }, function (err, payload) {
        if (!err) {
          payload.should.be.instanceof(Array)
        } else {
          console.log(err)
        }
        done()
      })
    })
  })
})
