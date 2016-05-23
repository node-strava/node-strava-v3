/**
 * Created by austin on 9/25/14.
 */


var should = require("should")
    , strava = require("../");

describe('uploads_test', function(){
    describe('#post()', function() {
        it('should upload a GPX file', function(done) {
            new Promise((resolve, reject) => {
              strava.uploads.post({
                  activity_type:'run'
                  , data_type:'gpx'
                  , name:'test activity'
                  , file:'test/assets/gpx_sample.gpx'
                  , statusCallback: function(err,payload) {
                    should.not.exist(err)
                    should.not.exist(payload.error)

                    if(payload.activity_id === null) {
                        (payload.status).should.be.exactly('Your activity is still being processed.')
                    } else {
                        (payload.status).should.be.exactly('Your activity is ready.');
                        (payload.activity_id).should.be.a.Number;

                        resolve(payload.activity_id);
                    }
                  }
              },function(err,payload) {});
            }).then((activityId) => {
              // clean up the uploaded activity
              strava.activities.delete({id: activityId}, (err, payload) => {
                if(err) console.log(err);
                done();
              })
            })
        });
    });

});
