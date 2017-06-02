var should = require("should")
    , testHelper = require("./_helper");

describe('util_test', function() {

    describe('#parseRateLimits', function () {

        it('should parse and return limits', function(done) {

            testHelper.getSampleAthlete(function(err,payload,limits) {
                limits.should.be.a.Object;
                limits.shortTermUsage.should.be.a.Number;
                limits.shortTermLimit.should.be.above(0).and.be.a.Number;
                limits.longTermUsage.should.be.a.Number;
                limits.longTermLimit.should.be.above(0).and.be.a.Number;
                done();
            })
        });
    });
});
