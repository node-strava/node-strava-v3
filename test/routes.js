/**
 * Created by dhritzkiv on 12/18/15.
 */

var should = require("should")
    , strava = require("../")
    , testHelper = require("./_helper");

var _sampleRoute;

describe('routes_test', function() {

    before(function(done) {

        testHelper.getSampleRoute(function(err,sampleRoute) {

            _sampleRoute = sampleRoute;
            done();
        });
    });

    describe('#get()', function () {

        it('should return information about the corresponding route', function(done) {
            strava.routes.get({id: _sampleRoute.id}, function (err, payload) {

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