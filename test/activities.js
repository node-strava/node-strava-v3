var should = require('should')
var sinon = require('sinon')
var strava = require('../')
var testHelper = require('./_helper')
var authenticator = require('../lib/authenticator')

var testActivity = {}

describe('activities_test', function () {
  before(function (done) {
    testHelper.getSampleActivity(function (err, sampleActivity) {
      if (err) { return done(err) }

      done()
    })
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

      strava.activities.create(args, function (err, payload) {
        if (!err) {
          testActivity = payload;
          (payload.resource_state).should.be.exactly(3)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  describe('#get()', function () {
    it('should return information about the corresponding activity', function (done) {
      strava.activities.get({ id: testActivity.id }, function (err, payload) {
        if (!err) {
          (payload.resource_state).should.be.exactly(3)
        } else {
          console.log(err)
        }

        done()
      })
    })

    it('should return information about the corresponding activity (Promise API)', function () {
      return strava.activities.get({ id: testActivity.id })
        .then(function (payload) {
          (payload.resource_state).should.be.exactly(3)
        })
    })

    it('should work with a specified access token', function (done) {
      var token = testHelper.getAccessToken()
      var tokenStub = sinon.stub(authenticator, 'getToken', function () {
        return undefined
      })

      strava.activities.get({
        id: testActivity.id,
        access_token: token
      }, function (err, payload) {
        should(err).be.null();
        (payload.resource_state).should.be.exactly(3)
        tokenStub.restore()
        done()
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

      strava.activities.update(args, function (err, payload) {
        if (!err) {
          (payload.resource_state).should.be.exactly(3);
          (payload.name).should.be.exactly(name)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  describe('#updateSportType()', function () {
    it('should update the sport type of an activity', function (done) {
      var sport_type = 'MountainBikeRide'
      var args = {
        id: testActivity.id,
        sport_type: sport_type
      }

      strava.activities.update(args, function (err, payload) {
        if (!err) {
          (payload.resource_state).should.be.exactly(3);
          (payload.sport_type).should.be.exactly(sport_type)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  // TODO can't test b/c this requires premium account
  describe('#listZones()', function () {
    xit('should list heart rate and power zones relating to activity', function (done) {
      strava.activities.listZones({ id: testActivity.id }, function (err, payload) {
        if (!err) {
          payload.should.be.instanceof(Array)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  describe('#listLaps()', function () {
    it('should list laps relating to activity', function (done) {
      strava.activities.listLaps({ id: testActivity.id }, function (err, payload) {
        if (!err) {
          payload.should.be.instanceof(Array)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  describe('#listComments()', function () {
    it('should list comments relating to activity', function (done) {
      strava.activities.listComments({ id: testActivity.id }, function (err, payload) {
        if (!err) {
          payload.should.be.instanceof(Array)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  describe('#listKudos()', function () {
    it('should list kudos relating to activity', function (done) {
      strava.activities.listKudos({ id: testActivity.id }, function (err, payload) {
        if (!err) {
          payload.should.be.instanceof(Array)
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  // TODO check w/ strava dudes, this is returning undefined instead of an empty array (no photos)
  describe('#listPhotos()', function () {
    xit('should list photos relating to activity', function (done) {
      strava.activities.listPhotos({ id: testActivity.id }, function (err, payload) {
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
