/**
 * Created by austin on 9/25/14.
 */


var should = require("should")
    , strava = require("../");

describe.skip('uploads_test', function(){

    describe('#post()', function() {

        it('should post example activity to strava', function(done) {

            strava.uploads.post({

                activity_type:'run'
                , data_type:'gpx'
                , name:'test activity'
                , file:'data/Evening_Run.gpx'
                , statusCallback: function(err,payload) {

                    //console.log(payload)
                    done();
                }

            },function(err,payload){

                if(!err) {
                    //console.log(payload);
                    //(payload.resource_state).should.be.exactly(3);
                    //(payload.city).should.be.exactly("Seattle");
                }
                else {
                    console.log(err);
                }

                //done();
            });
        });
    });

});
