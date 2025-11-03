/*  eslint camelcase: 0 */

const assert = require('assert')
const strava = require('../')
const nock = require('nock')
const testHelper = require('./_helper')

describe('streams', function () {
  beforeEach(function () {
    // Clean all nock interceptors before each test to ensure isolation
    nock.cleanAll()
    testHelper.setupMockAuth()
  })

  afterEach(function () {
    nock.cleanAll()
    testHelper.cleanupAuth()
  })

  describe('#activity()', function () {
    it('should return raw data associated to activity', async function () {
      const activityId = '2725479568'
      const mockStreams = [
        {
          type: 'distance',
          data: [2.9, 5.8, 8.5, 11.7, 15, 19, 23.2, 28, 32.8, 38.1, 43.8, 49.5],
          series_type: 'distance',
          original_size: 12,
          resolution: 'high'
        }
      ]

      nock('https://www.strava.com')
        .get(`/api/v3/activities/${activityId}/streams`)
        .query({
          keys: 'time,distance',
          resolution: 'low'
        })
        .matchHeader('authorization', 'Bearer test_token')
        .reply(200, mockStreams)

      const payload = await strava.streams.activity({
        id: activityId,
        keys: 'time,distance',
        resolution: 'low'
      })

      assert.ok(Array.isArray(payload))
      assert.ok(payload.length >= 1)
      // Check that we have distance stream
      const distanceStream = payload.find(stream => stream.type === 'distance')
      assert.ok(distanceStream)
      assert.ok(Array.isArray(distanceStream.data))
      assert.ok(distanceStream.data.length > 0)
    })
  })

  describe('#effort()', function () {
    it('should return raw data associated to segment_effort', async function () {
      const segmentEffortId = '68090153244'
      const mockStreams = [
        {
          type: 'distance',
          data: [904.5, 957.8, 963.1, 989.1, 1011.9, 1049.7, 1082.4, 1098.1, 1113.2, 1124.7, 1139.2, 1142.1, 1170.4, 1173],
          series_type: 'distance',
          original_size: 14,
          resolution: 'high'
        }
      ]

      nock('https://www.strava.com')
        .get(`/api/v3/segment_efforts/${segmentEffortId}/streams`)
        .query({
          keys: 'distance',
          resolution: 'low'
        })
        .matchHeader('authorization', 'Bearer test_token')
        .reply(200, mockStreams)

      const payload = await strava.streams.effort({
        id: segmentEffortId,
        keys: 'distance',
        resolution: 'low'
      })

      assert.ok(Array.isArray(payload))
      assert.strictEqual(payload.length, 1)
      assert.strictEqual(payload[0].type, 'distance')
      assert.ok(Array.isArray(payload[0].data))
      assert.ok(payload[0].data.length > 0)
    })
  })

  describe('#segment()', function () {
    it('should return raw data associated to segment', async function () {
      const segmentId = '646257'
      const mockStreams = [
        {
          type: 'latlng',
          data: [[37.833112, -122.483436], [37.832964, -122.483406]],
          series_type: 'distance',
          original_size: 2,
          resolution: 'high'
        },
        {
          type: 'distance',
          data: [0, 16.8],
          series_type: 'distance',
          original_size: 2,
          resolution: 'high'
        },
        {
          type: 'altitude',
          data: [92.4, 93.4],
          series_type: 'distance',
          original_size: 2,
          resolution: 'high'
        }
      ]

      nock('https://www.strava.com')
        .get(`/api/v3/segments/${segmentId}/streams`)
        .query({
          keys: 'distance',
          resolution: 'low'
        })
        .matchHeader('authorization', 'Bearer test_token')
        .reply(200, mockStreams)

      const payload = await strava.streams.segment({
        id: segmentId,
        keys: 'distance',
        resolution: 'low'
      })

      assert.ok(Array.isArray(payload))
      assert.ok(payload.length >= 1)
      // Verify we have expected stream types
      const streamTypes = payload.map(stream => stream.type)
      assert.ok(streamTypes.includes('distance') || streamTypes.includes('latlng') || streamTypes.includes('altitude'))
      // Check all streams have data
      payload.forEach(stream => {
        assert.ok(Array.isArray(stream.data))
        assert.ok(stream.data.length > 0)
      })
    })
  })

  describe('#route()', function () {
    it('should return raw data associated to route', async function () {
      const routeId = '12345678'
      const mockStreams = [
        {
          type: 'latlng',
          data: [[37.833112, -122.483436], [37.832964, -122.483406]]
        },
        {
          type: 'distance',
          data: [0, 16.8]
        },
        {
          type: 'altitude',
          data: [92.4, 93.4]
        }
      ]

      nock('https://www.strava.com')
        .get(`/api/v3/routes/${routeId}/streams`)
        .query(true) // Accept any query parameters since types is empty
        .matchHeader('authorization', 'Bearer test_token')
        .reply(200, mockStreams)

      const payload = await strava.streams.route({
        id: routeId,
        resolution: 'low'
      })

      assert.ok(Array.isArray(payload))
      assert.ok(payload.length >= 1)
      // Verify we have the expected stream types
      const streamTypes = payload.map(stream => stream.type)
      assert.ok(streamTypes.includes('latlng') || streamTypes.includes('distance') || streamTypes.includes('altitude'))
      // Check that all streams have data arrays
      payload.forEach(stream => {
        assert.ok(Array.isArray(stream.data))
        assert.ok(stream.data.length > 0)
      })
    })
  })
})
