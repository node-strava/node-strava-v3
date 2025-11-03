const assert = require('assert')
const strava = require('../')
const nock = require('nock')
const testHelper = require('./_helper')

describe('athletes', function () {
  before(function () {
    testHelper.setupMockAuth()
  })

  afterEach(function () {
    nock.cleanAll()
  })

  after(function () {
    testHelper.cleanupAuth()
  })

  describe('#stats()', function () {
    it('should return athlete stats information', async function () {
      const athleteId = 123456
      const mockResponse = {
        biggest_ride_distance: 175454,
        biggest_climb_elevation_gain: 1234,
        recent_ride_totals: {
          count: 3,
          distance: 65432,
          moving_time: 12345,
          elapsed_time: 13579,
          elevation_gain: 456,
          achievement_count: 2
        },
        recent_run_totals: {
          count: 5,
          distance: 21098,
          moving_time: 5678,
          elapsed_time: 5900,
          elevation_gain: 123,
          achievement_count: 1
        },
        recent_swim_totals: {
          count: 0,
          distance: 0,
          moving_time: 0,
          elapsed_time: 0,
          elevation_gain: 0,
          achievement_count: 0
        },
        ytd_ride_totals: {
          count: 45,
          distance: 1234567,
          moving_time: 234567,
          elapsed_time: 250000,
          elevation_gain: 12345,
          achievement_count: 15
        },
        ytd_run_totals: {
          count: 78,
          distance: 654321,
          moving_time: 123456,
          elapsed_time: 130000,
          elevation_gain: 3456,
          achievement_count: 8
        },
        ytd_swim_totals: {
          count: 0,
          distance: 0,
          moving_time: 0,
          elapsed_time: 0,
          elevation_gain: 0,
          achievement_count: 0
        },
        all_ride_totals: {
          count: 523,
          distance: 12345678,
          moving_time: 2345678,
          elapsed_time: 2500000,
          elevation_gain: 123456,
          achievement_count: 234
        },
        all_run_totals: {
          count: 456,
          distance: 3456789,
          moving_time: 987654,
          elapsed_time: 1000000,
          elevation_gain: 23456,
          achievement_count: 89
        },
        all_swim_totals: {
          count: 12,
          distance: 24000,
          moving_time: 12000,
          elapsed_time: 13000,
          elevation_gain: 0,
          achievement_count: 3
        }
      }

      nock('https://www.strava.com')
        .get(`/api/v3/athletes/${athleteId}/stats`)
        .query(true) // Accept any query parameters
        .matchHeader('authorization', 'Bearer test_token')
        .reply(200, mockResponse)

      const payload = await strava.athletes.stats({ id: athleteId })

      // Test the main structure
      assert.strictEqual(typeof payload.biggest_ride_distance, 'number')
      assert.strictEqual(typeof payload.biggest_climb_elevation_gain, 'number')

      // Test recent_ride_totals structure
      assert.strictEqual(typeof payload.recent_ride_totals, 'object')
      assert.strictEqual(typeof payload.recent_ride_totals.count, 'number')
      assert.strictEqual(typeof payload.recent_ride_totals.distance, 'number')
      assert.strictEqual(typeof payload.recent_ride_totals.moving_time, 'number')
      assert.strictEqual(typeof payload.recent_ride_totals.elapsed_time, 'number')
      assert.strictEqual(typeof payload.recent_ride_totals.elevation_gain, 'number')
      assert.strictEqual(typeof payload.recent_ride_totals.achievement_count, 'number')

      // Test that all expected total categories exist
      const totalCategories = ['recent', 'ytd', 'all']
      const activityTypes = ['ride', 'run', 'swim']

      totalCategories.forEach(category => {
        activityTypes.forEach(type => {
          const key = `${category}_${type}_totals`
          assert.ok(payload.hasOwnProperty(key), `Missing ${key}`)
          assert.strictEqual(typeof payload[key], 'object', `${key} should be an object`)
          assert.strictEqual(typeof payload[key].count, 'number', `${key}.count should be a number`)
          assert.strictEqual(typeof payload[key].distance, 'number', `${key}.distance should be a number`)
        })
      })

      // Test specific values
      assert.strictEqual(payload.biggest_ride_distance, 175454)
      assert.strictEqual(payload.recent_run_totals.count, 5)
      assert.strictEqual(payload.ytd_ride_totals.distance, 1234567)
      assert.strictEqual(payload.all_swim_totals.count, 12)
    })
  })
})
