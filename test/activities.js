var should = require('should')
var sinon = require('sinon')
var strava = require('../')
var testHelper = require('./_helper')
var authenticator = require('../lib/authenticator')

var testActivity = {}

describe('activities_test', function () {
  // Convert the `before` hook to a promise-based version
  before(function (done) {
    testHelper.getSampleActivity()
      .then(function (sampleActivity) {
        // We don't do much here, just ensuring we can fetch a sample activity
        done()
      })
      .catch(done)
  })

  describe('#create()', function () {
    it('should create an activity', function (done) {
      var args = {
        name: 'Most Epic Ride EVER!!!',
        elapsed_time: 18373,
        distance: 1557840,
        start_date_local: '2013-10-23T10:02:13Z',
        type: 'Ride'
      }

      // Remove the library callback, use promise, call done() in .then/.catch
      strava.activities.create(args)
        .then(function (payload) {
          testActivity = payload
          payload.resource_state.should.be.exactly(3)
          done()
        })
        .catch(function (err) {
          console.log(err)
          done(err)
        })
    })
  })

  describe('#get()', function () {
    it('should return information about the corresponding activity', function (done) {
      strava.activities.get({ id: testActivity.id })
        .then(function (payload) {
          payload.resource_state.should.be.exactly(3)
          done()
        })
        .catch(function (err) {
          console.log(err)
          done(err)
        })
    })

    // Already uses Promise API, no change needed
    it('should return information about the corresponding activity (Promise API)', function () {
      return strava.activities.get({ id: testActivity.id })
        .then(function (payload) {
          payload.resource_state.should.be.exactly(3)
        })
    })

    it('should work with a specified access token', function (done) {
      var token = testHelper.getAccessToken()
      // Use sinon.stub(...).callsFake(...) to define the stub’s behavior
      var tokenStub = sinon.stub(authenticator, 'getToken').callsFake(function () {
        return undefined
      })

      strava.activities.get({ id: testActivity.id, access_token: token })
        .then(function (payload) {
          should(payload).be.ok()
          payload.resource_state.should.be.exactly(3)
          tokenStub.restore()
          done()
        })
        .catch(function (err) {
          tokenStub.restore()
          console.log(err)
          done(err)
        })
    })
  })

  describe('#update()', function () {
    it('should update an activity', function (done) {
      var name = 'Run like the wind!!'
      var args = {
        id: testActivity.id,
        name: name
      }

      strava.activities.update(args)
        .then(function (payload) {
          payload.resource_state.should.be.exactly(3)
          payload.name.should.be.exactly(name)
          done()
        })
        .catch(function (err) {
          console.log(err)
          done(err)
        })
    })
  })

  describe('#updateSportType()', function () {
    it('should update the sport type of an activity', function (done) {
      var sportType = 'MountainBikeRide'
      var args = {
        id: testActivity.id,
        sportType: sportType
      }

      strava.activities.update(args)
        .then(function (payload) {
          payload.resource_state.should.be.exactly(3)
          payload.sportType.should.be.exactly(sportType)
          done()
        })
        .catch(function (err) {
          console.log(err)
          done(err)
        })
    })
  })

  // TODO can't test b/c this requires a premium account
  describe('#listZones()', function () {
    xit('should list heart rate and power zones relating to activity', function (done) {
      strava.activities.listZones({ id: testActivity.id })
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

  describe('#listLaps()', function () {
    it('should list laps relating to activity', function (done) {
      strava.activities.listLaps({ id: testActivity.id })
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

  describe('#listComments()', function () {
    it('should list comments relating to activity', function (done) {
      strava.activities.listComments({ id: testActivity.id })
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

  describe('#listKudos()', function () {
    it('should list kudos relating to activity', function (done) {
      strava.activities.listKudos({ id: testActivity.id })
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

  // TODO check w/ Strava dudes, this is returning undefined instead of an empty array (no photos)
  describe('#listPhotos()', function () {
    xit('should list photos relating to activity', function (done) {
      strava.activities.listPhotos({ id: testActivity.id })
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
