
var assert = require("assert");
var strava = require("../");

var athlete_id = "5256054";

describe('strava', function(){

    describe('#getCurrentAthlete()', function() {

        it('should return detailed athlete information about athlete associated to access_token', function(done) {

            strava.athlete.getCurrentAthlete(null,function(err,payload){

                if(!err) {
                    console.log(payload);
                }
                else {
                    console.log(err);
                }

                done();
            });
        });
    });

    describe.only('#getAthlete()',function(){
       it('should return detailed athlete information', function(done){

            strava.athlete.getAthlete({id:athlete_id},function(err,payload){

                if(!err) {
                    console.log(payload);
                }
                else {
                    console.log(err);
                }

                done();
            });
       })
    });
});
