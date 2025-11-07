const assert = require('assert')
const strava = require('../')
const nock = require('nock')
const testHelper = require('./_helper')

describe('segments', function () {
  beforeEach(function () {
    nock.cleanAll()
    testHelper.setupMockAuth()
  })

  afterEach(function () {
    nock.cleanAll()
    testHelper.cleanupAuth()
  })

  describe('#get()', function () {
    it('should return detailed information about segment (level 3)', async function () {
      const segmentId = '229781'
      const mockSegment = {
        id: 229781,
        resource_state: 3,
        name: 'Hawk Hill',
        activity_type: 'Ride',
        distance: 2684.82,
        average_grade: 5.7,
        maximum_grade: 14.2,
        elevation_high: 245.3,
        elevation_low: 92.4,
        start_latlng: [37.8331119, -122.4834356],
        end_latlng: [37.8280722, -122.4981393],
        climb_category: 1,
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        private: false,
        hazardous: false,
        starred: false,
        created_at: '2009-09-21T20:29:41Z',
        updated_at: '2018-02-15T09:04:18Z',
        total_elevation_gain: 155.733,
        map: {
          id: 's229781',
          resource_state: 3
        },
        effort_count: 309974,
        athlete_count: 30623,
        star_count: 2428,
        athlete_segment_stats: {
          pr_elapsed_time: 553,
          pr_date: '1993-04-03',
          effort_count: 2
        }
      }

      nock('https://www.strava.com')
        .get(`/api/v3/segments/${segmentId}`)
        .query(true)
        .matchHeader('authorization', 'Bearer test_token')
        .once()
        .reply(200, mockSegment)

      const payload = await strava.segments.get({ id: segmentId })

      assert.strictEqual(payload.resource_state, 3)
      assert.strictEqual(payload.id, 229781)
      assert.strictEqual(payload.name, 'Hawk Hill')
      assert.strictEqual(payload.activity_type, 'Ride')
      assert.strictEqual(payload.distance, 2684.82)
      assert.strictEqual(payload.city, 'San Francisco')
    })
  })

  describe('#listStarred()', function () {
    it('should list segments currently starred by athlete', async function () {
      const mockStarredSegments = [
        {
          id: 229781,
          resource_state: 3,
          name: 'Hawk Hill',
          activity_type: 'Ride',
          distance: 2684.82,
          average_grade: 5.7,
          maximum_grade: 14.2,
          elevation_high: 245.3,
          elevation_low: 92.4,
          start_latlng: [37.8331119, -122.4834356],
          end_latlng: [37.8280722, -122.4981393],
          climb_category: 1,
          city: 'San Francisco',
          state: 'CA',
          country: 'United States',
          private: false,
          hazardous: false,
          starred: true,
          created_at: '2009-09-21T20:29:41Z',
          updated_at: '2018-02-15T09:04:18Z',
          total_elevation_gain: 155.733,
          map: {
            id: 's229781',
            resource_state: 3
          },
          effort_count: 309974,
          athlete_count: 30623,
          star_count: 2428
        }
      ]

      nock('https://www.strava.com')
        .get('/api/v3/segments/starred')
        .query({ page: 1, per_page: 2 })
        .matchHeader('authorization', 'Bearer test_token')
        .once()
        .reply(200, mockStarredSegments)

      const payload = await strava.segments.listStarred({ page: 1, per_page: 2 })

      assert.ok(Array.isArray(payload))
      assert.ok(payload.length >= 1)
      assert.strictEqual(payload[0].name, 'Hawk Hill')
      assert.strictEqual(payload[0].starred, true)
    })
  })

  describe('#starSegment()', function () {
    it('should toggle starred segment', async function () {
      const segmentId = '229781'
      const mockSegmentStarred = {
        id: 229781,
        resource_state: 3,
        name: 'Hawk Hill',
        starred: true,
        activity_type: 'Ride'
      }

      nock('https://www.strava.com')
        .put(`/api/v3/segments/${segmentId}/starred`)
        .query(true)
        .matchHeader('authorization', 'Bearer test_token')
        .once()
        .reply(200, mockSegmentStarred)

      const payload = await strava.segments.starSegment({ id: segmentId, starred: true })

      assert.strictEqual(payload.starred, true)
    })
  })

  describe('#listEfforts()', function () {
    it('should list efforts on segment by current athlete', async function () {
      const segmentId = '229781'
      const mockEfforts = [
        {
          id: 1234567890,
          resource_state: 2,
          name: 'Effort 1',
          activity: { id: 98765432, resource_state: 1 },
          athlete: { id: 123456, resource_state: 1 },
          elapsed_time: 600,
          moving_time: 550,
          start_date: '2018-02-15T09:00:00Z',
          start_date_local: '2018-02-15T01:00:00Z'
        }
      ]

      nock('https://www.strava.com')
        .get(`/api/v3/segments/${segmentId}/all_efforts`)
        .query({ page: 1, per_page: 2 })
        .matchHeader('authorization', 'Bearer test_token')
        .once()
        .reply(200, mockEfforts)

      const payload = await strava.segments.listEfforts({ id: segmentId, page: 1, per_page: 2 })

      assert.ok(Array.isArray(payload))
      assert.ok(payload.length >= 1)
    })

    it('should provide efforts within specified date range', async function () {
      const segmentId = '229781'
      const startDate = new Date(new Date() - 604800000)
      const endDate = new Date()

      const startString = startDate.toISOString()
      const endString = endDate.toISOString()

      const mockEffortsInRange = [
        {
          id: 1234567890,
          resource_state: 2,
          name: 'Effort 1',
          elapsed_time: 600,
          moving_time: 550,
          start_date_local: endDate.toISOString()
        }
      ]

      nock('https://www.strava.com')
        .get(`/api/v3/segments/${segmentId}/all_efforts`)
        .query({ page: 1, per_page: 10, start_date_local: startString, end_date_local: endString })
        .matchHeader('authorization', 'Bearer test_token')
        .once()
        .reply(200, mockEffortsInRange)

      const payload = await strava.segments.listEfforts({
        id: segmentId,
        page: 1,
        per_page: 10,
        start_date_local: startString,
        end_date_local: endString
      })

      assert.ok(Array.isArray(payload))
      payload.forEach(effort => {
        const resultDate = new Date(effort.start_date_local)
        assert.ok(resultDate >= startDate)
        assert.ok(resultDate <= endDate)
      })
    })
  })

  describe('#explore()', function () {
    it('should return segments within given bounds', async function () {
      const mockExploreResponse = {
        segments: [
          {
            id: 229781,
            resource_state: 2,
            name: 'Hawk Hill',
            activity_type: 'Ride',
            distance: 2684.82,
            average_grade: 5.7,
            maximum_grade: 14.2,
            elevation_high: 245.3,
            elevation_low: 92.4,
            start_latlng: [37.8331119, -122.4834356],
            end_latlng: [37.8280722, -122.4981393],
            climb_category: 1,
            city: 'San Francisco',
            state: 'CA',
            country: 'United States',
            private: false,
            hazardous: false,
            starred: false
          }
        ]
      }

      nock('https://www.strava.com')
        .get('/api/v3/segments/explore')
        .query({ bounds: '37.821362,-122.505373,37.842038,-122.465977', activity_type: 'running' })
        .matchHeader('authorization', 'Bearer test_token')
        .once()
        .reply(200, mockExploreResponse)

      const payload = await strava.segments.explore({
        bounds: '37.821362,-122.505373,37.842038,-122.465977',
        activity_type: 'running'
      })

      assert.ok(payload.segments)
      assert.ok(Array.isArray(payload.segments))
      assert.ok(payload.segments.length >= 1)
      assert.strictEqual(payload.segments[0].name, 'Hawk Hill')
    })
  })
})
