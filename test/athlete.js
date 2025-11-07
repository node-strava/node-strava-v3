const assert = require('assert')
const strava = require('../')
const nock = require('nock')
const testHelper = require('./_helper')

describe('athlete', function () {
  beforeEach(function () {
    // Clean all nock interceptors before each test to ensure isolation
    nock.cleanAll()
    testHelper.setupMockAuth()
  })

  afterEach(function () {
    nock.cleanAll()
    testHelper.cleanupAuth()
  })

  describe('#get()', function () {
    it('should return detailed athlete information about athlete associated to access_token (level 3)', async function () {
      const mockAthlete = {
        id: 123456,
        username: 'testuser',
        resource_state: 3,
        firstname: 'Test',
        lastname: 'User',
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        sex: 'M',
        premium: true,
        summit: true,
        created_at: '2012-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        badge_type_id: 1,
        profile_medium: 'https://example.com/medium.jpg',
        profile: 'https://example.com/large.jpg',
        friend: null,
        follower: null,
        follower_count: 100,
        friend_count: 50,
        mutual_friend_count: 0,
        athlete_type: 1,
        date_preference: '%m/%d/%Y',
        measurement_preference: 'feet',
        clubs: [],
        ftp: 250,
        weight: 70,
        bikes: [],
        shoes: []
      }

      nock('https://www.strava.com')
        .get('/api/v3/athlete')
        .query(true)
        .matchHeader('authorization', 'Bearer test_token')
        .once()
        .reply(200, mockAthlete)

      const response = await strava.athlete.get({})

      assert.strictEqual(response.resource_state, 3)
      assert.strictEqual(response.id, 123456)
      assert.strictEqual(response.username, 'testuser')
      assert.strictEqual(response.firstname, 'Test')
      assert.strictEqual(response.lastname, 'User')
      assert.strictEqual(response.city, 'San Francisco')
      assert.strictEqual(response.weight, 70)
    })
  })

  describe('#listActivities()', function () {
    it('should return information about activities associated to athlete with access_token', async function () {
      const mockActivities = [
        {
          resource_state: 2,
          athlete: {
            id: 134815,
            resource_state: 1
          },
          name: 'Happy Friday',
          distance: 24931.4,
          moving_time: 4500,
          elapsed_time: 4500,
          total_elevation_gain: 0,
          type: 'Ride',
          sport_type: 'MountainBikeRide',
          workout_type: null,
          id: 154504250376823,
          external_id: 'garmin_push_12345678987654321',
          upload_id: 987654321234567900000,
          start_date: '2018-05-02T12:15:09Z',
          start_date_local: '2018-05-02T05:15:09Z',
          timezone: '(GMT-08:00) America/Los_Angeles',
          utc_offset: -25200,
          start_latlng: null,
          end_latlng: null,
          location_city: null,
          location_state: null,
          location_country: 'United States',
          achievement_count: 0,
          kudos_count: 3,
          comment_count: 1,
          athlete_count: 1,
          photo_count: 0,
          map: {
            id: 'a12345678987654321',
            summary_polyline: null,
            resource_state: 2
          },
          device_name: 'Garmin Edge 1030',
          trainer: true,
          commute: false,
          manual: false,
          private: false,
          flagged: false,
          gear_id: 'b12345678987654321',
          from_accepted_tag: false,
          average_speed: 5.54,
          max_speed: 11,
          average_cadence: 67.1,
          average_watts: 175.3,
          weighted_average_watts: 210,
          kilojoules: 788.7,
          device_watts: true,
          has_heartrate: true,
          average_heartrate: 140.3,
          max_heartrate: 178,
          max_watts: 406,
          pr_count: 0,
          total_photo_count: 1,
          has_kudoed: false,
          suffer_score: 82
        },
        {
          resource_state: 2,
          athlete: {
            id: 167560,
            resource_state: 1
          },
          name: 'Bondcliff',
          distance: 23676.5,
          moving_time: 5400,
          elapsed_time: 5400,
          total_elevation_gain: 0,
          type: 'Ride',
          sport_type: 'MountainBikeRide',
          workout_type: null,
          id: 1234567809,
          external_id: 'garmin_push_12345678987654321',
          upload_id: 1234567819,
          start_date: '2018-04-30T12:35:51Z',
          start_date_local: '2018-04-30T05:35:51Z',
          timezone: '(GMT-08:00) America/Los_Angeles',
          utc_offset: -25200,
          start_latlng: null,
          end_latlng: null,
          location_city: null,
          location_state: null,
          location_country: 'United States',
          achievement_count: 0,
          kudos_count: 4,
          comment_count: 0,
          athlete_count: 1,
          photo_count: 0,
          map: {
            id: 'a12345689',
            summary_polyline: null,
            resource_state: 2
          },
          device_name: 'Garmin Edge 1030',
          trainer: true,
          commute: false,
          manual: false,
          private: false,
          flagged: false,
          gear_id: 'b12345678912343',
          from_accepted_tag: false,
          average_speed: 4.385,
          max_speed: 8.8,
          average_cadence: 69.8,
          average_watts: 200,
          weighted_average_watts: 214,
          kilojoules: 1080,
          device_watts: true,
          has_heartrate: true,
          average_heartrate: 152.4,
          max_heartrate: 183,
          max_watts: 403,
          pr_count: 0,
          total_photo_count: 1,
          has_kudoed: false,
          suffer_score: 162
        }
      ]

      const nowSeconds = Math.floor(Date.now() / 1000)

      nock('https://www.strava.com')
        .get('/api/v3/athlete/activities')
        .query({
          after: nowSeconds + 3600,
          before: nowSeconds + 3600
        })
        .matchHeader('authorization', 'Bearer test_token')
        .once()
        .reply(200, mockActivities)

      const response = await strava.athlete.listActivities({
        after: nowSeconds + 3600,
        before: nowSeconds + 3600
      })

      assert.ok(Array.isArray(response))
      assert.strictEqual(response.length, 2)
      assert.strictEqual(response[0].name, 'Happy Friday')
      assert.strictEqual(response[0].type, 'Ride')
      assert.strictEqual(response[0].sport_type, 'MountainBikeRide')
      assert.strictEqual(response[0].distance, 24931.4)
      assert.strictEqual(response[1].name, 'Bondcliff')
      assert.strictEqual(response[1].athlete_count, 1)
    })
  })

  describe('#listClubs()', function () {
    it('should return information about clubs associated to athlete with access_token', async function () {
      const mockClubs = [
        {
          id: 231407,
          resource_state: 2,
          name: 'The Strava Club',
          profile_medium: 'https://dgalywyr863hv.cloudfront.net/pictures/clubs/231407/5319085/1/medium.jpg',
          profile: 'https://dgalywyr863hv.cloudfront.net/pictures/clubs/231407/5319085/1/large.jpg',
          cover_photo: 'https://dgalywyr863hv.cloudfront.net/pictures/clubs/231407/5098428/4/large.jpg',
          cover_photo_small: 'https://dgalywyr863hv.cloudfront.net/pictures/clubs/231407/5098428/4/small.jpg',
          sport_type: 'other',
          city: 'San Francisco',
          state: 'California',
          country: 'United States',
          private: false,
          member_count: 93151,
          featured: false,
          verified: true,
          url: 'strava'
        }
      ]

      nock('https://www.strava.com')
        .get('/api/v3/athlete/clubs')
        .query(true)
        .matchHeader('authorization', 'Bearer test_token')
        .once()
        .reply(200, mockClubs)

      const response = await strava.athlete.listClubs({})

      assert.ok(Array.isArray(response))
      assert.strictEqual(response.length, 1)
      assert.strictEqual(response[0].id, 231407)
      assert.strictEqual(response[0].name, 'The Strava Club')
      assert.strictEqual(response[0].sport_type, 'other')
      assert.strictEqual(response[0].city, 'San Francisco')
      assert.strictEqual(response[0].member_count, 93151)
      assert.strictEqual(response[0].verified, true)
    })
  })

  describe('#listZones()', function () {
    it('should return information about heart-rate and power zones associated to athlete with access_token', async function () {
      const mockZones = [
        {
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
            },
            {
              max: 150,
              min: 100,
              time: 536
            },
            {
              max: 200,
              min: 150,
              time: 672
            },
            {
              max: 250,
              min: 200,
              time: 821
            },
            {
              max: 300,
              min: 250,
              time: 529
            },
            {
              max: 350,
              min: 300,
              time: 251
            },
            {
              max: 400,
              min: 350,
              time: 80
            },
            {
              max: 450,
              min: 400,
              time: 81
            },
            {
              max: -1,
              min: 450,
              time: 343
            }
          ],
          type: 'power',
          resource_state: 3,
          sensor_based: true
        }
      ]

      nock('https://www.strava.com')
        .get('/api/v3/athlete/zones')
        .query(true)
        .matchHeader('authorization', 'Bearer test_token')
        .once()
        .reply(200, mockZones)

      const response = await strava.athlete.listZones({})

      assert.ok(Array.isArray(response))
      assert.strictEqual(response.length, 1)
      assert.strictEqual(response[0].type, 'power')
      assert.strictEqual(response[0].resource_state, 3)
      assert.strictEqual(response[0].sensor_based, true)
      assert.ok(Array.isArray(response[0].distribution_buckets))
      assert.strictEqual(response[0].distribution_buckets.length, 11)
      assert.strictEqual(response[0].distribution_buckets[0].time, 1498)
      assert.strictEqual(response[0].distribution_buckets[10].min, 450)
      assert.strictEqual(response[0].distribution_buckets[10].max, -1)
    })
  })

  describe('#update()', function () {
    it('should update the weight of the current athlete', async function () {
      const weight = 75.5
      const mockUpdatedAthlete = {
        id: 123456,
        username: 'testuser',
        resource_state: 3,
        firstname: 'Test',
        lastname: 'User',
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        weight: weight
      }

      nock('https://www.strava.com')
        .put('/api/v3/athlete', { weight })
        .matchHeader('authorization', 'Bearer test_token')
        .once()
        .reply(200, mockUpdatedAthlete)

      const response = await strava.athlete.update({ weight })

      assert.strictEqual(response.weight, weight)
      assert.strictEqual(response.id, 123456)
      assert.strictEqual(response.city, 'San Francisco')
    })
  })
})
