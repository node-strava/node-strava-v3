const {
  describe,
  it,
  beforeEach,
  mock
} = require('node:test')
const assert = require('node:assert')
const { request } = require('undici')

class GearDataTest {
  static async getGear ({ id, token }) {
    const gear = await request(`https://www.strava.com//api/v3/gear/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    )

    return gear.json()
  }
}

async function run () {
  const gear = await GearDataTest.getGear({ id: 'b1231', token: process.env.STRAVA_ACCESS_TOKEN })
  return gear
}

describe('Get Gear Data', () => {
  // only needed if you're not using the context variable
  // in the it() calls
  beforeEach(() => mock.restoreAll())

  it('should return the gear data with given id', async (context) => {
    context.mock.method(
      GearDataTest,
      GearDataTest.getGear.name
    ).mock.mockImplementation(async () => (
      {
        'id': 'b1231',
        'primary': false,
        'resource_state': 3,
        'distance': 388206,
        'brand_name': 'BMC',
        'model_name': 'Teammachine',
        'frame_type': 3,
        'description': 'My Bike.'
      }
    ))

    const result = await run()

    const expected = {
      'brand_name': 'BMC',
      'description': 'My Bike.',
      'distance': 388206,
      'frame_type': 3,
      'id': 'b1231',
      'model_name': 'Teammachine',
      'primary': false,
      'resource_state': 3
    }

    assert.deepStrictEqual(GearDataTest.getGear.mock.callCount(), 1)

    assert.deepStrictEqual(result, expected)
  })
})
