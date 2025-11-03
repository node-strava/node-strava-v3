const assert = require('assert')
const strava = require('../')
const nock = require('nock')
const testHelper = require('./_helper')

describe('routes', function () {
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
    it('should return information about the corresponding route', async function () {
      const routeId = '1234567890'
      const mockRoute = {
        id: routeId,
        resource_state: 3,
        name: 'Test Route',
        description: 'A test route for testing',
        athlete: {
          id: 123456,
          resource_state: 1
        },
        distance: 28099,
        elevation_gain: 516,
        map: {
          id: 'r1234567890',
          polyline: 'encoded_polyline_data',
          resource_state: 3
        },
        type: 1,
        sub_type: 1,
        private: false,
        starred: false,
        timestamp: 1234567890,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        estimated_moving_time: 5400,
        segments: []
      }

      nock('https://www.strava.com')
        .get(`/api/v3/routes/${routeId}`)
        .query(true)
        .matchHeader('authorization', 'Bearer test_token')
        .reply(200, mockRoute)

      const payload = await strava.routes.get({ id: routeId })

      assert.strictEqual(payload.resource_state, 3)
      assert.strictEqual(payload.id, routeId)
      assert.strictEqual(payload.name, 'Test Route')
      assert.strictEqual(typeof payload.distance, 'number')
      assert.strictEqual(typeof payload.elevation_gain, 'number')
      assert.ok(payload.map)
      assert.strictEqual(payload.map.resource_state, 3)
    })

    it('should return the GPX file requested with the route information', async function () {
      const routeId = '1234567890'
      const mockGpxData = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Strava">
  <metadata>
    <name>Test Route</name>
    <desc>A test route for testing</desc>
  </metadata>
  <trk>
    <name>Test Route</name>
    <trkseg>
      <trkpt lat="37.7749" lon="-122.4194">
        <ele>10.0</ele>
      </trkpt>
      <trkpt lat="37.7751" lon="-122.4196">
        <ele>12.0</ele>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`

      nock('https://www.strava.com')
        .get(`/api/v3/routes/${routeId}/export_gpx`)
        .query(true)
        .matchHeader('authorization', 'Bearer test_token')
        .reply(200, mockGpxData, {
          'Content-Type': 'application/gpx+xml'
        })

      const payload = await strava.routes.getFile({ id: routeId, file_type: 'gpx' })

      assert.strictEqual(typeof payload, 'string')
      assert.ok(payload.includes('<?xml'))
      assert.ok(payload.includes('<gpx'))
      assert.ok(payload.includes('Test Route'))
    })

    it('should return the TCX file requested with the route information', async function () {
      const routeId = '1234567890'
      const mockTcxData = `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2">
  <Courses>
    <Course>
      <Name>Test Route</Name>
      <Lap>
        <TotalTimeSeconds>5400</TotalTimeSeconds>
        <DistanceMeters>28099</DistanceMeters>
        <BeginPosition>
          <LatitudeDegrees>37.7749</LatitudeDegrees>
          <LongitudeDegrees>-122.4194</LongitudeDegrees>
        </BeginPosition>
      </Lap>
      <Track>
        <Trackpoint>
          <Position>
            <LatitudeDegrees>37.7749</LatitudeDegrees>
            <LongitudeDegrees>-122.4194</LongitudeDegrees>
          </Position>
          <AltitudeMeters>10.0</AltitudeMeters>
        </Trackpoint>
      </Track>
    </Course>
  </Courses>
</TrainingCenterDatabase>`

      nock('https://www.strava.com')
        .get(`/api/v3/routes/${routeId}/export_tcx`)
        .query(true)
        .matchHeader('authorization', 'Bearer test_token')
        .reply(200, mockTcxData, {
          'Content-Type': 'application/tcx+xml'
        })

      const payload = await strava.routes.getFile({ id: routeId, file_type: 'tcx' })

      assert.strictEqual(typeof payload, 'string')
      assert.ok(payload.includes('<?xml'))
      assert.ok(payload.includes('TrainingCenterDatabase'))
      assert.ok(payload.includes('Test Route'))
      assert.ok(payload.includes('<Course>'))
    })
  })
})
