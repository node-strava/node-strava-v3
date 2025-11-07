const assert = require('assert')
const strava = require('../')
const nock = require('nock')
const testHelper = require('./_helper')
const tmp = require('tmp')
const fs = require('fs')

describe('uploads_test', function () {
  beforeEach(function () {
    // Clean all nock interceptors before each test to ensure isolation
    nock.cleanAll()
    testHelper.setupMockAuth()
  })

  afterEach(function () {
    nock.cleanAll()
    testHelper.cleanupAuth()
  })

  describe('#post()', function () {
    it('should upload a GPX file', async () => {
      const tmpFile = tmp.fileSync({ suffix: '.gpx' })
      const gpxFilename = tmpFile.name
      try {
        fs.writeFileSync(gpxFilename, '<?xml version="1.0"?><gpx></gpx>')
        const uploadId = '123456'
        const activityId = 987654321

        // Mock the initial upload POST request
        nock('https://www.strava.com')
          .post('/api/v3/uploads')
          .matchHeader('authorization', 'Bearer test_token')
          .once() // Ensure this interceptor is used only once
          .reply(201, {
            id_str: uploadId,
            activity_id: null,
            external_id: 'test_external_id',
            id: 123456,
            error: null,
            status: 'Your activity is still being processed.'
          })

        // Mock the first status check - still processing
        nock('https://www.strava.com')
          .get(`/api/v3/uploads/${uploadId}`)
          .matchHeader('authorization', 'Bearer test_token')
          .once()
          .reply(200, {
            id_str: uploadId,
            activity_id: null,
            external_id: 'test_external_id',
            id: 123456,
            error: null,
            status: 'Your activity is still being processed.'
          })

        // Mock the second status check - completed
        nock('https://www.strava.com')
          .get(`/api/v3/uploads/${uploadId}`)
          .matchHeader('authorization', 'Bearer test_token')
          .once()
          .reply(200, {
            id_str: uploadId,
            activity_id: activityId,
            external_id: 'test_external_id',
            id: 123456,
            error: null,
            status: 'Your activity is ready.'
          })

        let statusCallbackCount = 0
        let finalPayload = null

        await strava.uploads.post({
          activity_type: 'run',
          sport_type: 'Run',
          data_type: 'gpx',
          name: 'test activity',
          file: gpxFilename,
          statusCallback: function (err, payload) {
            assert.strictEqual(err, null)
            statusCallbackCount++

            if (payload.status === 'Your activity is ready.') {
              finalPayload = payload
            }
          }
        })

        assert.strictEqual(statusCallbackCount, 2)
        assert.strictEqual(finalPayload.activity_id, activityId)
        assert.strictEqual(finalPayload.status, 'Your activity is ready.')
      } finally {
        tmpFile.removeCallback()
      }
    })

    it('should upload a GPX file without status callback', async () => {
      const tmpFile = tmp.fileSync({ suffix: '.gpx' })
      const gpxFilename = tmpFile.name
      try {
        fs.writeFileSync(gpxFilename, '<?xml version="1.0"?><gpx></gpx>')
        const uploadId = '789012'

        // Mock the initial upload POST request
        nock('https://www.strava.com')
          .post('/api/v3/uploads')
          .matchHeader('authorization', 'Bearer test_token')
          .once() // Ensure this interceptor is used only once
          .reply(201, {
            id_str: uploadId,
            activity_id: null,
            external_id: 'test_external_id_2',
            id: 789012,
            error: null,
            status: 'Your activity is still being processed.'
          })

        const result = await strava.uploads.post({
          activity_type: 'run',
          sport_type: 'Run',
          data_type: 'gpx',
          name: 'test activity without callback',
          file: gpxFilename
        })

        assert.strictEqual(result.id_str, uploadId)
        assert.strictEqual(result.status, 'Your activity is still being processed.')
      } finally {
        tmpFile.removeCallback()
      }
    })
  })
})
