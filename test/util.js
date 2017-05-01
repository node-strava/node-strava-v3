var should = require("should")
    , assert = require("assert")
    , testHelper = require("./_helper");

describe('util_test', function() {

    describe('#parseRateLimits', function () {

        var limits;
        before(function(done) {
           testHelper.getSampleAthlete(function(err,payload,gotLimits) {
            if (err)
              return done(err)

             limits = gotLimits || null;
            done();
           });
        });

        it('should parse and return limits', function() {
          limits.should.be.a.Object;
          limits.shortTermUsage.should.be.a.Number;
          limits.shortTermLimit.should.be.above(0).and.be.a.Number;
          limits.longTermUsage.should.be.a.Number;
          limits.longTermLimit.should.be.above(0).and.be.a.Number;
        });
    });
});
