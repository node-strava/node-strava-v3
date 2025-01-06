var should = require('should')
var sinon = require('sinon')
var strava = require('../')
var testHelper = require('./_helper')
var authenticator = require('../lib/authenticator')

var testActivity = {}

describe('activities_test', function () {
  // Convert the `before` hook to an async function
  before(async function (done) {
    try {
      await testHelper.getSampleActivity()
      // We don't do much here; just ensuring we can fetch a sample activity
      done()
    } catch (err) {
      done(err)
    }
  })

  describe('#create()', function () {
    it('should create an activity', async function (done) {
      try {
        var args = {
          name: 'Most Epic Ride EVER!!!',
          elapsed_time: 18373,
          distance: 1557840,
          start_date_local: '2013-10-23T10:02:13Z',
          type: 'Ride'
        }

        var payload = await strava.activities.create(args)
        testActivity = payload
        payload.resource_state.should.be.exactly(3)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })

  describe('#get()', function () {
    it('should return information about the corresponding activity', async function (done) {
      try {
        var payload = await strava.activities.get({ id: testActivity.id })
        payload.resource_state.should.be.exactly(3)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })

    it('should return information about the corresponding activity (Promise API)', async function (done) {
      try {
        const payload = await strava.activities.get({ id: testActivity.id })
        payload.resource_state.should.be.exactly(3)
      } catch (err) {
        console.log(err)
        done(err)
      }
    })

    it('should work with a specified access token', async function (done) {
      var token = testHelper.getAccessToken()
      var tokenStub = sinon.stub(authenticator, 'getToken').callsFake(() => {
        return undefined
      })
      try {
        var payload = await strava.activities.get({ id: testActivity.id, access_token: token })
        should(payload).be.ok()
        payload.resource_state.should.be.exactly(3)
        tokenStub.restore()
        done()
      } catch (err) {
        tokenStub.restore()
        console.log(err)
        done(err)
      }
    })
  })

  describe('#update()', function () {
    it('should update an activity', async function (done) {
      var name = 'Run like the wind!!'
      var args = {
        id: testActivity.id,
        name: name
      }

      try {
        var payload = await strava.activities.update(args)
        payload.resource_state.should.be.exactly(3)
        payload.name.should.be.exactly(name)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })

  describe('#updateSportType()', function () {
    it('should update the sport type of an activity', async function (done) {
      var sportType = 'MountainBikeRide'
      var args = {
        id: testActivity.id,
        sportType: sportType
      }

      try {
        var payload = await strava.activities.update(args)
        payload.resource_state.should.be.exactly(3)
        payload.sportType.should.be.exactly(sportType)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })

  // TODO can't test because this requires a premium account
  describe('#listZones()', function () {
    xit('should list heart rate and power zones relating to activity', async function (done) {
      try {
        var payload = await strava.activities.listZones({ id: testActivity.id })
        payload.should.be.instanceof(Array)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })

  describe('#listLaps()', function () {
    it('should list laps relating to activity', async function (done) {
      try {
        var payload = await strava.activities.listLaps({ id: testActivity.id })
        payload.should.be.instanceof(Array)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })

  describe('#listComments()', function () {
    it('should list comments relating to activity', async function (done) {
      try {
        var payload = await strava.activities.listComments({ id: testActivity.id })
        payload.should.be.instanceof(Array)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })

  describe('#listKudos()', function () {
    it('should list kudos relating to activity', async function (done) {
      try {
        var payload = await strava.activities.listKudos({ id: testActivity.id })
        payload.should.be.instanceof(Array)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })

  // TODO check with Strava, this is returning undefined instead of an empty array (no photos)
  describe('#listPhotos()', function () {
    xit('should list photos relating to activity', async function (done) {
      try {
        var payload = await strava.activities.listPhotos({ id: testActivity.id })
        payload.should.be.instanceof(Array)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    })
  })
})
