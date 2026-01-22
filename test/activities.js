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

  describe('#listZones()', function () {
    it('should list heart rate and power zones relating to activity', async function () {
      // Mock the list zones API call
      nock('https://www.strava.com')
        .get('/api/v3/activities/' + testActivity.id + '/zones')
        .reply(200, [
          {
            score: 82,
            distribution_buckets: [
              {
                max: 0,
                min: 0,
                time: 1498
              },
              {
                max: 50,
                min: 0,
                time: 62
              },
              {
                max: 100,
                min: 50,
                time: 169
              }
            ],
            type: 'power',
            sensor_based: true,
            points: 250,
            custom_zones: false,
            max: 450
          },
          {
            score: 75,
            distribution_buckets: [
              {
                max: 0,
                min: 0,
                time: 200
              },
              {
                max: 100,
                min: 0,
                time: 150
              },
              {
                max: 120,
                min: 100,
                time: 300
              }
            ],
            type: 'heartrate',
            sensor_based: false,
            points: 180,
            custom_zones: true,
            max: 200
          }
        ])

      const payload = await strava.activities.listZones({ id: testActivity.id })
      assert.ok(Array.isArray(payload))
      assert.strictEqual(payload.length, 2)

      // Verify power zone
      const powerZone = payload.find(zone => zone.type === 'power')
      assert.ok(powerZone)
      assert.strictEqual(typeof powerZone.score, 'number')
      assert.strictEqual(powerZone.score, 82)
      assert.ok(Array.isArray(powerZone.distribution_buckets))
      assert.strictEqual(powerZone.distribution_buckets.length, 3)
      assert.strictEqual(powerZone.type, 'power')
      assert.strictEqual(powerZone.sensor_based, true)
      assert.strictEqual(typeof powerZone.points, 'number')
      assert.strictEqual(powerZone.points, 250)
      assert.strictEqual(powerZone.custom_zones, false)
      assert.strictEqual(typeof powerZone.max, 'number')
      assert.strictEqual(powerZone.max, 450)

      // Verify distribution bucket structure
      const bucket = powerZone.distribution_buckets[0]
      assert.strictEqual(typeof bucket.min, 'number')
      assert.strictEqual(typeof bucket.max, 'number')
      assert.strictEqual(typeof bucket.time, 'number')

      // Verify heartrate zone
      const heartrateZone = payload.find(zone => zone.type === 'heartrate')
      assert.ok(heartrateZone)
      assert.strictEqual(typeof heartrateZone.score, 'number')
      assert.strictEqual(heartrateZone.score, 75)
      assert.ok(Array.isArray(heartrateZone.distribution_buckets))
      assert.strictEqual(heartrateZone.type, 'heartrate')
      assert.strictEqual(heartrateZone.sensor_based, false)
      assert.strictEqual(typeof heartrateZone.points, 'number')
      assert.strictEqual(heartrateZone.points, 180)
      assert.strictEqual(heartrateZone.custom_zones, true)
      assert.strictEqual(typeof heartrateZone.max, 'number')
      assert.strictEqual(heartrateZone.max, 200)
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
})
