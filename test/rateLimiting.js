
var should = require('should')
var rateLimiting = require('../lib/rateLimiting')
var testHelper = require('./_helper')

describe('rateLimiting_test', function () {
  describe('#fractionReached', function () {
    it('should update requestTime', function () {
      var before = rateLimiting.requestTime
      var headers = {
        'date': 'Tue, 10 Oct 2013 20:11:05 GMT',
        'x-ratelimit-limit': '600,30000',
        'x-ratelimit-usage': '300,10000'
      }
      rateLimiting.updateRateLimits(headers)

      should(before).not.not.eql(rateLimiting.requestTime)
    })

    it('should calculate rate limit correctly', function () {
      (rateLimiting.fractionReached()).should.eql(0.5)
    })

    it('should calculate rate limit correctly', function () {
      var headers = {
        'x-ratelimit-limit': '600,30000',
        'x-ratelimit-usage': '300,27000'
      }
      rateLimiting.updateRateLimits(headers);
      (rateLimiting.fractionReached()).should.eql(0.9)
    })

    it('should set values to zero when headers are nonsense', function () {
      var headers = {
        'x-ratelimit-limit': 'xxx',
        'x-ratelimit-usage': 'zzz'
      }
      rateLimiting.updateRateLimits(headers)
      rateLimiting.longTermUsage.should.eql(0)
      rateLimiting.shortTermUsage.should.eql(0)
      rateLimiting.longTermLimit.should.eql(0)
      rateLimiting.shortTermLimit.should.eql(0)
    })
  })

  describe('#exceeded', function () {
    it('should exceed limit when short term usage exceeds short term limit', function () {
      rateLimiting.longTermLimit = 1
      rateLimiting.longTermUsage = 0

      rateLimiting.shortTermLimit = 100
      rateLimiting.shortTermUsage = 200

      should(rateLimiting.exceeded()).be.true()
    })

    it('should not exceed rate limit when short usage is less than short term limit', function () {
      rateLimiting.shortTermLimit = 200
      rateLimiting.shortTermUsage = 100

      rateLimiting.exceeded().should.be.false()
    })

    it('should exceed rate limit when long term usage exceeds limit', function () {
      rateLimiting.shortTermLimit = 1
      rateLimiting.shortTermUsage = 0
      rateLimiting.longTermLimit = 100
      rateLimiting.longTermUsage = 200

      rateLimiting.exceeded().should.be.true()
    })

    it('should not exceed rate limit when long term usage is less than long term limit', function () {
      rateLimiting.longTermLimit = 200
      rateLimiting.longTermUsage = 100

      rateLimiting.exceeded().should.be.be.false()
    })
  })

  describe('legacy callback limits', function () {
    var limits
    before(function (done) {
      testHelper.getSampleAthlete(function (err, payload, gotLimits) {
        if (err) { return done(err) }

        limits = gotLimits || null
        done()
      })
    })

    it('should parse and return limits', function () {
      limits.should.be.a.Object()
      limits.shortTermUsage.should.be.a.Number()
      limits.shortTermLimit.should.be.above(0).and.be.a.Number()
      limits.longTermUsage.should.be.a.Number()
      limits.longTermLimit.should.be.above(0).and.be.a.Number()
    })
  })
})
