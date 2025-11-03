
const assert = require('assert')
const rateLimiting = require('../lib/rateLimiting')

describe('rateLimiting_test', function () {
  describe('#fractionReached', function () {
    it('should update requestTime', function () {
      const headers = {
        'date': 'Tue, 10 Oct 2013 20:11:05 GMT',
        'x-ratelimit-limit': '600,30000',
        'x-ratelimit-usage': '300,10000'
      }
      const result = rateLimiting.updateRateLimits(headers)

      assert.ok(result)
      assert.strictEqual(rateLimiting.shortTermUsage, 300)
      assert.strictEqual(rateLimiting.shortTermLimit, 600)
    })

    it('should calculate rate limit correctly', function () {
      assert.strictEqual(rateLimiting.fractionReached(), 0.5)
    })

    it('should calculate rate limit correctly', function () {
      const headers = {
        'x-ratelimit-limit': '600,30000',
        'x-ratelimit-usage': '300,27000'
      }
      rateLimiting.updateRateLimits(headers)
      assert.strictEqual(rateLimiting.fractionReached(), 0.9)
    })

    it('should set values to zero when headers are nonsense', function () {
      const headers = {
        'x-ratelimit-limit': 'xxx',
        'x-ratelimit-usage': 'zzz'
      }
      rateLimiting.updateRateLimits(headers)
      assert.strictEqual(rateLimiting.longTermUsage, 0)
      assert.strictEqual(rateLimiting.shortTermUsage, 0)
      assert.strictEqual(rateLimiting.longTermLimit, 0)
      assert.strictEqual(rateLimiting.shortTermLimit, 0)
    })
  })

  describe('#exceeded', function () {
    it('should exceed limit when short term usage exceeds short term limit', function () {
      rateLimiting.longTermLimit = 1
      rateLimiting.longTermUsage = 0

      rateLimiting.shortTermLimit = 100
      rateLimiting.shortTermUsage = 200

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
      rateLimiting.longTermLimit = 100
      rateLimiting.longTermUsage = 200

      assert.strictEqual(rateLimiting.exceeded(), true)
    })

    it('should not exceed rate limit when long term usage is less than long term limit', function () {
      rateLimiting.longTermLimit = 200
      rateLimiting.longTermUsage = 100

      assert.strictEqual(rateLimiting.exceeded(), false)
    })
  })
})
