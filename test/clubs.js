require('should')
var strava = require('../')
var testHelper = require('./_helper')

var _sampleClub

describe('clubs_test', function () {
  before(function (done) {
    testHelper.getSampleClub()
      .then(function (payload) {
        _sampleClub = payload
        done()
      })
      .catch(done)
  })

  describe('#get()', function () {
    it('should return club detailed information', function (done) {
      strava.clubs.get({ id: _sampleClub.id })
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

  describe('#listMembers()', function () {
    it('should return a summary list of athletes in club', function (done) {
      strava.clubs.listMembers({ id: _sampleClub.id })
        .then(function (payload) {
          payload.should.be.instanceof(Array)
          done()
        })
        .catch(function (err) {
          console.log(err)
          done(err)
        })
    })
  })

  describe('#listActivities()', function () {
    it('should return a list of club activities', function (done) {
      strava.clubs.listActivities({ id: _sampleClub.id })
        .then(function (payload) {
          payload.should.be.instanceof(Array)
          done()
        })
        .catch(function (err) {
          console.log(err)
          done(err)
        })
    })
  })
})
