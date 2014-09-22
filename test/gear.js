
var should = require("should")
    , strava = require("../");

var gear_id = "g497741";

describe('gear', function() {

    describe.only('#get()', function () {

        it('should return detailed athlete information about gear (level 3)', function (done) {

            strava.gear.get({id:gear_id}, function (err, payload) {

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