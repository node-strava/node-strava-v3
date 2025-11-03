const assert = require('assert')
const strava = require('../')
const nock = require('nock')
const testHelper = require('./_helper')

describe('gear_test', function () {
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
    it('should return detailed athlete information about gear (level 3)', async function () {
      const gearId = 'b1231'
      const mockResponse = {
        id: 'b1231',
        primary: false,
        resource_state: 3,
        distance: 388206,
        brand_name: 'BMC',
        model_name: 'Teammachine',
        frame_type: 3,
        description: 'My Bike.'
      }

      nock('https://www.strava.com')
        .get(`/api/v3/gear/${gearId}`)
        .matchHeader('authorization', 'Bearer test_token')
        .reply(200, mockResponse)

      const payload = await strava.gear.get({ id: gearId })

      assert.strictEqual(payload.id, 'b1231')
      assert.strictEqual(payload.primary, false)
      assert.strictEqual(payload.resource_state, 3)
      assert.strictEqual(payload.distance, 388206)
      assert.strictEqual(payload.brand_name, 'BMC')
      assert.strictEqual(payload.model_name, 'Teammachine')
      assert.strictEqual(payload.frame_type, 3)
      assert.strictEqual(payload.description, 'My Bike.')
    })
  })
})
