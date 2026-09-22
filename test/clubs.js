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
    it('should reject because Strava removed the endpoint', async function () {
      await assert.rejects(
        () => strava.clubs.listMembers({ id: 1 }),
        (err) => {
          assert.ok(err instanceof Error)
          assert.match(err.message, /listMembers is unavailable/)
          assert.match(err.message, /removed/)
          assert.match(err.message, /changelog 2026-09-01/)
          return true
        }
      )
      assert.strictEqual(nock.pendingMocks().length, 0)
    })
  })

  describe('#listActivities()', function () {
    it('should reject because Strava removed the endpoint', async function () {
      await assert.rejects(
        () => strava.clubs.listActivities({ id: 1 }),
        (err) => {
          assert.ok(err instanceof Error)
          assert.match(err.message, /listActivities is unavailable/)
          assert.match(err.message, /removed/)
          assert.match(err.message, /changelog 2026-09-01/)
          return true
        }
      )
      assert.strictEqual(nock.pendingMocks().length, 0)
    })
  })

  describe('#listAdmins()', function () {
    it('should reject because Strava removed the endpoint', async function () {
      await assert.rejects(
        () => strava.clubs.listAdmins({ id: 1 }),
        (err) => {
          assert.ok(err instanceof Error)
          assert.match(err.message, /listAdmins is unavailable/)
          assert.match(err.message, /removed/)
          assert.match(err.message, /changelog 2026-09-01/)
          return true
        }
      )
      assert.strictEqual(nock.pendingMocks().length, 0)
    })
  })
})
