const assert = require('assert')
const strava = require('../')
const nock = require('nock')
const testHelper = require('./_helper')

describe('clubs', function () {
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
    it('should return club detailed information', async function () {
      const clubId = 1
      const mockClub = {
        id: clubId,
        resource_state: 3,
        name: 'Team Strava Cycling',
        profile_medium: 'https://dgalywyr863hv.cloudfront.net/pictures/clubs/1/1582/4/medium.jpg',
        profile: 'https://dgalywyr863hv.cloudfront.net/pictures/clubs/1/1582/4/large.jpg',
        cover_photo: 'https://dgalywyr863hv.cloudfront.net/pictures/clubs/1/4328276/1/large.jpg',
        cover_photo_small: 'https://dgalywyr863hv.cloudfront.net/pictures/clubs/1/4328276/1/small.jpg',
        sport_type: 'cycling',
        activity_types: ['Ride', 'VirtualRide', 'EBikeRide', 'Velomobile', 'Handcycle'],
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        private: true,
        member_count: 116,
        featured: false,
        verified: false,
        url: 'team-strava-bike',
        membership: 'member',
        admin: false,
        owner: false,
        description: 'Private club for Cyclists who work at Strava.',
        club_type: 'company',
        post_count: 29,
        owner_id: 759,
        following_count: 107
      }

      nock('https://www.strava.com')
        .get(`/api/v3/clubs/${clubId}`)
        .query(true)
        .matchHeader('authorization', 'Bearer test_token')
        .once()
        .reply(200, mockClub)

      const payload = await strava.clubs.get({ id: clubId })

      assert.strictEqual(payload.resource_state, 3)
      assert.strictEqual(payload.id, clubId)
      assert.strictEqual(payload.name, 'Team Strava Cycling')
      assert.strictEqual(payload.sport_type, 'cycling')
      assert.strictEqual(payload.city, 'San Francisco')
      assert.strictEqual(payload.state, 'California')
      assert.strictEqual(payload.country, 'United States')
      assert.strictEqual(payload.member_count, 116)
      assert.strictEqual(payload.private, true)
      assert.ok(Array.isArray(payload.activity_types))
      assert.strictEqual(payload.activity_types.length, 5)
      assert.ok(payload.activity_types.includes('Ride'))
      assert.strictEqual(payload.club_type, 'company')
      assert.strictEqual(payload.owner_id, 759)
    })
  })

  describe('#listMembers()', function () {
    it('should return a summary list of athletes in club', async function () {
      const clubId = 1
      const mockMembers = [
        {
          resource_state: 2,
          firstname: 'John',
          lastname: 'Doe',
          membership: 'member',
          admin: false,
          owner: false
        },
        {
          resource_state: 2,
          firstname: 'Jane',
          lastname: 'Smith',
          membership: 'member',
          admin: true,
          owner: false
        },
        {
          resource_state: 2,
          firstname: 'Bob',
          lastname: 'Johnson',
          membership: 'member',
          admin: false,
          owner: true
        }
      ]

      nock('https://www.strava.com')
        .get(`/api/v3/clubs/${clubId}/members`)
        .query(true)
        .matchHeader('authorization', 'Bearer test_token')
        .once()
        .reply(200, mockMembers)

      const payload = await strava.clubs.listMembers({ id: clubId })

      assert.ok(Array.isArray(payload))
      assert.strictEqual(payload.length, 3)
      assert.strictEqual(payload[0].resource_state, 2)
      assert.strictEqual(payload[0].firstname, 'John')
      assert.strictEqual(payload[0].lastname, 'Doe')
      assert.strictEqual(payload[1].admin, true)
      assert.strictEqual(payload[2].owner, true)
    })
  })

  describe('#listActivities()', function () {
    it('should return a list of club activities', async function () {
      const clubId = 1
      const mockActivities = [
        {
          resource_state: 2,
          athlete: {
            resource_state: 2,
            firstname: 'Peter',
            lastname: 'S.'
          },
          name: 'World Championship',
          distance: 2641.7,
          moving_time: 577,
          elapsed_time: 635,
          total_elevation_gain: 8.8,
          type: 'Ride',
          sport_type: 'MountainBikeRide',
          workout_type: null
        },
        {
          resource_state: 2,
          athlete: {
            resource_state: 2,
            firstname: 'Maria',
            lastname: 'K.'
          },
          name: 'Morning Run',
          distance: 5234.2,
          moving_time: 1823,
          elapsed_time: 1900,
          total_elevation_gain: 45.3,
          type: 'Run',
          sport_type: 'Run',
          workout_type: null
        }
      ]

      nock('https://www.strava.com')
        .get(`/api/v3/clubs/${clubId}/activities`)
        .query(true)
        .matchHeader('authorization', 'Bearer test_token')
        .once()
        .reply(200, mockActivities)

      const payload = await strava.clubs.listActivities({ id: clubId })

      assert.ok(Array.isArray(payload))
      assert.strictEqual(payload.length, 2)

      // Check first activity
      assert.strictEqual(payload[0].resource_state, 2)
      assert.strictEqual(payload[0].name, 'World Championship')
      assert.strictEqual(payload[0].distance, 2641.7)
      assert.strictEqual(payload[0].moving_time, 577)
      assert.strictEqual(payload[0].elapsed_time, 635)
      assert.strictEqual(payload[0].total_elevation_gain, 8.8)
      assert.strictEqual(payload[0].type, 'Ride')
      assert.strictEqual(payload[0].sport_type, 'MountainBikeRide')
      assert.strictEqual(payload[0].workout_type, null)
      assert.ok(payload[0].athlete)
      assert.strictEqual(payload[0].athlete.firstname, 'Peter')
      assert.strictEqual(payload[0].athlete.lastname, 'S.')

      // Check second activity
      assert.strictEqual(payload[1].name, 'Morning Run')
      assert.strictEqual(payload[1].type, 'Run')
      assert.strictEqual(payload[1].sport_type, 'Run')
      assert.ok(payload[1].athlete)
      assert.strictEqual(payload[1].athlete.firstname, 'Maria')
    })
  })
})
