
var should = require("should")
    , strava = require("../");

var segment_id = "5100058";

describe('segmentEfforts', function() {

    describe('#get()', function () {

        it('should return detailed information about segment effort (level 3)', function (done) {

            strava.segmentEfforts.get({id:segment_id}, function (err, payload) {

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