
var should = require("should")
    , strava = require("../")
    , testHelper = require("./_helper");

var _sampleGear;

describe('gear_test', function() {

    before(function(done) {

        testHelper.getSampleGear(function(err,payload) {

            _sampleGear = payload;
            done();
        });
    });

    describe('#get()', function () {

        it('should return detailed athlete information about gear (level 3)', function (done) {

            strava.gear.get({id:_sampleGear.id}, function (err, payload) {

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