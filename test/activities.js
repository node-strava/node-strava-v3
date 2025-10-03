var should = require('should')
var nock = require('nock')
var strava = require('../')

var testActivity = {}

describe('activities_test', function () {
  before(function () {
    // Set a default test activity to use in tests
    testActivity = { id: 123456789, resource_state: 3, name: 'Sample Activity' }
  })
  
  afterEach(function () {
    // Clean all nock interceptors after each test
    nock.cleanAll()
  })

  describe('#create()', function () {
    it('should create an activity', function () {
      var args = {
        name: 'Most Epic Ride EVER!!!',
        elapsed_time: 18373,
        distance: 1557840,
        start_date_local: '2013-10-23T10:02:13Z',
        type: 'Ride'
      }

      // Mock the create activity API call
      nock('https://www.strava.com')
        .post('/api/v3/activities')
        .matchHeader('authorization', /Bearer .+/)
        .reply(201, {
          id: 987654321,
          resource_state: 3,
          name: 'Most Epic Ride EVER!!!',
          elapsed_time: 18373,
          distance: 1557840,
          start_date_local: '2013-10-23T10:02:13Z',
          type: 'Ride'
        })

      return strava.activities.create(args)
        .then(function (payload) {
          testActivity = payload;
          (payload.resource_state).should.be.exactly(3)
        })
    })
  })

  describe('#get()', function () {
    it('should return information about the corresponding activity', function () {
      // Mock the get activity API call
      nock('https://www.strava.com')
        .get('/api/v3/activities/' + testActivity.id)
        .query(true)
        .matchHeader('authorization', /Bearer .+/)
        .reply(200, {
          id: testActivity.id,
          resource_state: 3
        })

      return strava.activities.get({ id: testActivity.id })
        .then(function (payload) {
          (payload.resource_state).should.be.exactly(3)
        })
    })

    it('should return information about the corresponding activity (Promise API)', function () {
      // Mock the get activity API call
      nock('https://www.strava.com')
        .get('/api/v3/activities/' + testActivity.id)
        .query(true)
        .matchHeader('authorization', /Bearer .+/)
        .reply(200, {
          id: testActivity.id,
          resource_state: 3
        })

      return strava.activities.get({ id: testActivity.id })
        .then(function (payload) {
          (payload.resource_state).should.be.exactly(3)
        })
    })

    it('should work with a specified access token', function () {
      const token = 'mock-access-token-12345'
      
      // Mock the Strava API endpoint
      nock('https://www.strava.com')
        .get('/api/v3/activities/' + testActivity.id)
        .query(true)
        .matchHeader('authorization', 'Bearer ' + token)
        .reply(200, { resource_state: 3 })

      return strava.activities.get({ id: testActivity.id, access_token: token })
        .then(function (payload) {
          should(payload).be.ok()
          ;(payload.resource_state).should.be.exactly(3)
        })
    })
  })

  describe('#update()', function () {
    it('should update an activity', function () {
      var name = 'Run like the wind!!'
      var args = {
        id: testActivity.id,
        name: name
      }

      // Mock the update activity API call
      nock('https://www.strava.com')
        .put('/api/v3/activities/' + testActivity.id)
        .matchHeader('authorization', /Bearer .+/)
        .reply(200, {
          id: testActivity.id,
          resource_state: 3,
          name: name
        })

      return strava.activities.update(args)
        .then(function (payload) {
          (payload.resource_state).should.be.exactly(3)
          ;(payload.name).should.be.exactly(name)
        })
    })
  })

  describe('#updateSportType()', function () {
    it('should update the sport type of an activity', function () {
      var sportType = 'MountainBikeRide'
      var args = {
        id: testActivity.id,
        sportType: sportType
      }

      // Mock the update activity API call
      nock('https://www.strava.com')
        .put('/api/v3/activities/' + testActivity.id)
        .matchHeader('authorization', /Bearer .+/)
        .reply(200, {
          id: testActivity.id,
          resource_state: 3,
          sportType: sportType
        })

      return strava.activities.update(args)
        .then(function (payload) {
          (payload.resource_state).should.be.exactly(3)
          ;(payload.sportType).should.be.exactly(sportType)
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
    it('should list laps relating to activity', function () {
      // Mock the list laps API call
      nock('https://www.strava.com')
        .get('/api/v3/activities/' + testActivity.id + '/laps')
        .query(true)
        .matchHeader('authorization', /Bearer .+/)
        .reply(200, [])

      return strava.activities.listLaps({ id: testActivity.id })
        .then(function (payload) {
          payload.should.be.instanceof(Array)
        })
    })
  })

  describe('#listComments()', function () {
    it('should list comments relating to activity', function () {
      // Mock the list comments API call
      nock('https://www.strava.com')
        .get('/api/v3/activities/' + testActivity.id + '/comments')
        .query(true)
        .matchHeader('authorization', /Bearer .+/)
        .reply(200, [])

      return strava.activities.listComments({ id: testActivity.id })
        .then(function (payload) {
          payload.should.be.instanceof(Array)
        })
    })
  })

  describe('#listKudos()', function () {
    it('should list kudos relating to activity', function () {
      // Mock the list kudos API call
      nock('https://www.strava.com')
        .get('/api/v3/activities/' + testActivity.id + '/kudos')
        .query(true)
        .matchHeader('authorization', /Bearer .+/)
        .reply(200, [])

      return strava.activities.listKudos({ id: testActivity.id })
        .then(function (payload) {
          payload.should.be.instanceof(Array)
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
