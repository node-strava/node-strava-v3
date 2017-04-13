
var should = require("should")
    , strava = require("../")
    , testHelper = require("./_helper");

var _sampleSegmentEffort;

describe.skip('segmentEfforts_test', function() {

    before(function(done) {

        testHelper.getSampleSegmentEffort(function(err,payload) {

            _sampleSegmentEffort = payload;
            done();
        });
    });

    describe('#get()', function () {

        it('should return detailed information about segment effort (level 3)', function (done) {

            strava.segmentEfforts.get({id:_sampleSegmentEffort.id}, function (err, payload) {

                if (!err) {
                    //console.log(payload);
                    (payload.resource_state).should.be.exactly(3);
                }
                else {
                    console.log(err);
                }

                done();
            });
        });
    });

});