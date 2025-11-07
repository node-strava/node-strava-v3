const assert = require('assert')
const nock = require('nock')
const strava = require('../')
const testHelper = require('./_helper')

let testActivity = {}

describe('activities_test', function () {
  beforeEach(function () {
    nock.cleanAll()
    testHelper.setupMockAuth()
    // Set a default test activity to use in tests
    testActivity = { id: 123456789, resource_state: 3, name: 'Sample Activity' }
  })

  afterEach(function () {
    nock.cleanAll()
    testHelper.cleanupAuth()
  })

  describe('#create()', function () {
    it('should create an activity', async function () {
      const args = {
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
        .once()
        .reply(201, {
          id: 987654321,
          resource_state: 3,
          name: 'Most Epic Ride EVER!!!',
          elapsed_time: 18373,
          distance: 1557840,
          start_date_local: '2013-10-23T10:02:13Z',
          type: 'Ride'
        })

      const payload = await strava.activities.create(args)
      testActivity = payload
      assert.strictEqual(payload.resource_state, 3)
    })
  })

  describe('#get()', function () {
    it('should return information about the corresponding activity', async function () {
      // Mock the get activity API call
      nock('https://www.strava.com')
        .get('/api/v3/activities/' + testActivity.id)
        .query(true)
        .matchHeader('authorization', /Bearer .+/)
        .once()
        .reply(200, {
          id: testActivity.id,
          resource_state: 3
        })

      const payload = await strava.activities.get({ id: testActivity.id })
      assert.strictEqual(payload.resource_state, 3)
    })

    it('should return information about the corresponding activity (Promise API)', async function () {
      // Mock the get activity API call
      nock('https://www.strava.com')
        .get('/api/v3/activities/' + testActivity.id)
        .query(true)
        .matchHeader('authorization', /Bearer .+/)
        .once()
        .reply(200, {
          id: testActivity.id,
          resource_state: 3
        })

      const payload = await strava.activities.get({ id: testActivity.id })
      assert.strictEqual(payload.resource_state, 3)
    })

    it('should work with a specified access token', async function () {
      const token = 'mock-access-token-12345'

      // Mock the Strava API endpoint
      nock('https://www.strava.com')
        .get('/api/v3/activities/' + testActivity.id)
        .query(true)
        .matchHeader('authorization', 'Bearer ' + token)
        .once()
        .reply(200, { resource_state: 3 })

      const payload = await strava.activities.get({ id: testActivity.id, access_token: token })
      assert.ok(payload)
      assert.strictEqual(payload.resource_state, 3)
    })
  })

  describe('#update()', function () {
    it('should update an activity', async function () {
      const name = 'Run like the wind!!'
      const args = {
        id: testActivity.id,
        name: name
      }

      // Mock the update activity API call
      nock('https://www.strava.com')
        .put('/api/v3/activities/' + testActivity.id)
        .matchHeader('authorization', /Bearer .+/)
        .once()
        .reply(200, {
          id: testActivity.id,
          resource_state: 3,
          name: name
        })

      const payload = await strava.activities.update(args)
      assert.strictEqual(payload.resource_state, 3)
      assert.strictEqual(payload.name, name)
    })
  })

  describe('#updateSportType()', function () {
    it('should update the sport type of an activity', async function () {
      const sportType = 'MountainBikeRide'
      const args = {
        id: testActivity.id,
        sportType: sportType
      }

      // Mock the update activity API call
      nock('https://www.strava.com')
        .put('/api/v3/activities/' + testActivity.id)
        .matchHeader('authorization', /Bearer .+/)
        .once()
        .reply(200, {
          id: testActivity.id,
          resource_state: 3,
          sport_type: sportType
        })

      const payload = await strava.activities.update(args)
      assert.strictEqual(payload.resource_state, 3)
      assert.strictEqual(payload.sport_type, sportType)
    })
  })

  // TODO can't test b/c this requires premium account
  describe('#listZones()', function () {
    xit('should list heart rate and power zones relating to activity', function (done) {
      strava.activities.listZones({ id: testActivity.id }, function (err, payload) {
        if (!err) {
          assert.ok(Array.isArray(payload))
        } else {
          console.log(err)
        }

        done()
      })
    })
  })

  describe('#listLaps()', function () {
    it('should list laps relating to activity', async function () {
      // Mock the list laps API call
      nock('https://www.strava.com')
        .get('/api/v3/activities/' + testActivity.id + '/laps')
        .query(true)
        .matchHeader('authorization', /Bearer .+/)
        .once()
        .reply(200, [])

      const payload = await strava.activities.listLaps({ id: testActivity.id })
      assert.ok(Array.isArray(payload))
    })
  })

  describe('#listComments()', function () {
    it('should list comments relating to activity', async function () {
      // Mock the list comments API call
      nock('https://www.strava.com')
        .get('/api/v3/activities/' + testActivity.id + '/comments')
        .query(true)
        .matchHeader('authorization', /Bearer .+/)
        .once()
        .reply(200, [])

      const payload = await strava.activities.listComments({ id: testActivity.id })
      assert.ok(Array.isArray(payload))
    })
  })

  describe('#listKudos()', function () {
    it('should list kudos relating to activity', async function () {
      // Mock the list kudos API call
      nock('https://www.strava.com')
        .get('/api/v3/activities/' + testActivity.id + '/kudos')
        .query(true)
        .matchHeader('authorization', /Bearer .+/)
        .once()
        .reply(200, [])

      const payload = await strava.activities.listKudos({ id: testActivity.id })
      assert.ok(Array.isArray(payload))
    })
  })

  // TODO check w/ strava dudes, this is returning undefined instead of an empty array (no photos)
  describe('#listPhotos()', function () {
    xit('should list photos relating to activity', function (done) {
      strava.activities.listPhotos({ id: testActivity.id }, function (err, payload) {
        if (!err) {
          assert.ok(Array.isArray(payload))
        } else {
          console.log(err)
        }

        done()
      })
    })
  })
})
