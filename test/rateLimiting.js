
const assert = require('assert')
const rateLimiting = require('../lib/rateLimiting')

describe('rateLimiting_test', function () {
  describe('#fractionReached', function () {
    it('should update requestTime', function () {
      const headers = {
        'date': 'Tue, 10 Oct 2013 20:11:05 GMT',
        // Test with default rate limits https://developers.strava.com/docs/rate-limits/
        'x-ratelimit-limit': '200,2000',
        'x-ratelimit-usage': '100,1000',
        'x-readratelimit-limit': '100,1000',
        'x-readratelimit-usage': '50,500'
      }
      const result = rateLimiting.updateRateLimits(headers)

      assert.ok(result)
      assert.strictEqual(rateLimiting.shortTermUsage, 100)
      assert.strictEqual(rateLimiting.shortTermLimit, 200)
      assert.strictEqual(rateLimiting.longTermUsage, 1000)
      assert.strictEqual(rateLimiting.longTermLimit, 2000)
      assert.strictEqual(rateLimiting.readShortTermUsage, 50)
      assert.strictEqual(rateLimiting.readShortTermLimit, 100)
      assert.strictEqual(rateLimiting.readLongTermUsage, 500)
      assert.strictEqual(rateLimiting.readLongTermLimit, 1000)
    })

    it('should calculate rate limit correctly', function () {
      assert.strictEqual(rateLimiting.fractionReached(), 0.5)
    })

    it('should calculate rate limit correctly', function () {
      const headers = {
        'x-ratelimit-limit': '200,2000',
        'x-ratelimit-usage': '100,1800',
        'x-readratelimit-limit': '100,1000',
        'x-readratelimit-usage': '50,500'
      }
      rateLimiting.updateRateLimits(headers)
      assert.strictEqual(rateLimiting.fractionReached(), 0.9)
    })

    it('should set values to zero when headers are nonsense', function () {
      const headers = {
        'x-ratelimit-limit': 'xxx',
        'x-ratelimit-usage': 'zzz',
        'x-readratelimit-limit': 'yyy',
        'x-readratelimit-usage': 'www'
      }
      rateLimiting.updateRateLimits(headers)
      assert.strictEqual(rateLimiting.longTermUsage, 0)
      assert.strictEqual(rateLimiting.shortTermUsage, 0)
      assert.strictEqual(rateLimiting.longTermLimit, 0)
      assert.strictEqual(rateLimiting.shortTermLimit, 0)
      assert.strictEqual(rateLimiting.readShortTermUsage, 0)
      assert.strictEqual(rateLimiting.readShortTermLimit, 0)
      assert.strictEqual(rateLimiting.readLongTermUsage, 0)
      assert.strictEqual(rateLimiting.readLongTermLimit, 0)
    })
  })

  describe('#exceeded', function () {
    it('should exceed limit when short term usage exceeds short term limit', function () {
      rateLimiting.longTermLimit = 1
      rateLimiting.longTermUsage = 0

      rateLimiting.shortTermLimit = 200
      rateLimiting.shortTermUsage = 300

      assert.strictEqual(rateLimiting.exceeded(), true)
    })

    it('should not exceed rate limit when short usage is less than short term limit', function () {
      rateLimiting.shortTermLimit = 200
      rateLimiting.shortTermUsage = 100

      assert.strictEqual(rateLimiting.exceeded(), false)
    })

    it('should exceed rate limit when long term usage exceeds limit', function () {
      rateLimiting.shortTermLimit = 1
      rateLimiting.shortTermUsage = 0
      rateLimiting.longTermLimit = 2000
      rateLimiting.longTermUsage = 3000

      assert.strictEqual(rateLimiting.exceeded(), true)
    })

    it('should not exceed rate limit when long term usage is less than long term limit', function () {
      rateLimiting.longTermLimit = 2000
      rateLimiting.longTermUsage = 1000

      assert.strictEqual(rateLimiting.exceeded(), false)
    })

    it('should not exceed rate limit when both limits are 0 (no limit set)', function () {
      rateLimiting.shortTermLimit = 0
      rateLimiting.shortTermUsage = 0
      rateLimiting.longTermLimit = 0
      rateLimiting.longTermUsage = 0

      assert.strictEqual(rateLimiting.exceeded(), false)
    })

    it('should not exceed rate limit after clear() when limits are 0', function () {
      rateLimiting.clear()
      assert.strictEqual(rateLimiting.shortTermLimit, 0)
      assert.strictEqual(rateLimiting.longTermLimit, 0)
      assert.strictEqual(rateLimiting.exceeded(), false)
    })
  })

  describe('#readFractionReached', function () {
    it('should calculate read rate limit correctly', function () {
      const headers = {
        'x-ratelimit-limit': '200,2000',
        'x-ratelimit-usage': '100,1000',
        'x-readratelimit-limit': '100,1000',
        'x-readratelimit-usage': '50,500'
      }
      rateLimiting.updateRateLimits(headers)
      assert.strictEqual(rateLimiting.readFractionReached(), 0.5)
    })

    it('should calculate read rate limit correctly', function () {
      const headers = {
        'x-ratelimit-limit': '200,2000',
        'x-ratelimit-usage': '100,1000',
        'x-readratelimit-limit': '100,1000',
        'x-readratelimit-usage': '50,900'
      }
      rateLimiting.updateRateLimits(headers)
      assert.strictEqual(rateLimiting.readFractionReached(), 0.9)
    })
  })

  describe('#readExceeded', function () {
    it('should exceed limit when read short term usage exceeds read short term limit', function () {
      rateLimiting.readLongTermLimit = 1
      rateLimiting.readLongTermUsage = 0

      rateLimiting.readShortTermLimit = 100
      rateLimiting.readShortTermUsage = 101

      assert.strictEqual(rateLimiting.readExceeded(), true)
    })

    it('should not exceed read rate limit when read short term usage is less than read short term limit', function () {
      rateLimiting.readShortTermLimit = 100
      rateLimiting.readShortTermUsage = 50

      assert.strictEqual(rateLimiting.readExceeded(), false)
    })

    it('should exceed read rate limit when read long term usage exceeds limit', function () {
      rateLimiting.readShortTermLimit = 1
      rateLimiting.readShortTermUsage = 0
      rateLimiting.readLongTermLimit = 1000
      rateLimiting.readLongTermUsage = 1001

      assert.strictEqual(rateLimiting.readExceeded(), true)
    })

    it('should not exceed read rate limit when read long term usage is less than read long term limit', function () {
      rateLimiting.readLongTermLimit = 1000
      rateLimiting.readLongTermUsage = 500

      assert.strictEqual(rateLimiting.readExceeded(), false)
    })

    it('should not exceed read rate limit when both read limits are 0 (no limit set)', function () {
      rateLimiting.readShortTermLimit = 0
      rateLimiting.readShortTermUsage = 0
      rateLimiting.readLongTermLimit = 0
      rateLimiting.readLongTermUsage = 0

      assert.strictEqual(rateLimiting.readExceeded(), false)
    })

    it('should not exceed read rate limit after clear() when read limits are 0', function () {
      rateLimiting.clear()
      assert.strictEqual(rateLimiting.readShortTermLimit, 0)
      assert.strictEqual(rateLimiting.readLongTermLimit, 0)
      assert.strictEqual(rateLimiting.readExceeded(), false)
    })
  })
})
