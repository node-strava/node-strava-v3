const assert = require('assert')
const strava = require('../')
const nock = require('nock')
const testHelper = require('./_helper')

describe('segmentEfforts_test', function () {
  before(function () {
    testHelper.setupMockAuth()
  })

  afterEach(function () {
    nock.cleanAll()
  })

  after(function () {
    testHelper.cleanupAuth()
  })

  describe('#get()', function () {
    it('should return detailed information about segment effort (level 3)', async function () {
      const segmentEffortId = 1234556789
      const mockResponse = {
        id: 1234556789,
        resource_state: 3,
        name: "Alpe d'Huez",
        activity: {
          id: 3454504,
          resource_state: 1
        },
        athlete: {
          id: 54321,
          resource_state: 1
        },
        elapsed_time: 381,
        moving_time: 340,
        start_date: '2018-02-12T16:12:41Z',
        start_date_local: '2018-02-12T08:12:41Z',
        distance: 83,
        start_index: 65,
        end_index: 83,
        segment: {
          id: 63450,
          resource_state: 2,
          name: "Alpe d'Huez",
          activity_type: 'Run',
          distance: 780.35,
          average_grade: -0.5,
          maximum_grade: 0,
          elevation_high: 21,
          elevation_low: 17.2,
          start_latlng: [37.808407654682, -122.426682919323],
          end_latlng: [37.808297909724, -122.421324329674],
          climb_category: 0,
          city: 'San Francisco',
          state: 'CA',
          country: 'United States',
          private: false,
          hazardous: false,
          starred: false
        },
        kom_rank: null,
        pr_rank: null,
        achievements: [],
        athlete_segment_stats: {
          pr_elapsed_time: 212,
          pr_date: '2015-02-12',
          effort_count: 149
        }
      }

      nock('https://www.strava.com')
        .get(`/api/v3/segment_efforts/${segmentEffortId}`)
        .matchHeader('authorization', 'Bearer test_token')
        .reply(200, mockResponse)

      const payload = await strava.segmentEfforts.get({ id: segmentEffortId })

      assert.strictEqual(payload.id, 1234556789)
      assert.strictEqual(payload.resource_state, 3)
      assert.strictEqual(payload.name, "Alpe d'Huez")
      assert.strictEqual(payload.elapsed_time, 381)
      assert.strictEqual(payload.moving_time, 340)
      assert.strictEqual(payload.distance, 83)
      assert.strictEqual(payload.segment.id, 63450)
      assert.strictEqual(payload.segment.name, "Alpe d'Huez")
      assert.strictEqual(payload.segment.city, 'San Francisco')
      assert.strictEqual(payload.athlete_segment_stats.effort_count, 149)
    })
  })
})
