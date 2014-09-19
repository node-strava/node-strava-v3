/**
 * Created by austin on 9/18/14.
 */

//var Strava = new require('./lib/strava');

var fs = require('fs')

    , util = require('./lib/util')
    , athlete = require('./lib/athlete')
    , athletes = require('./lib/athletes')
    ;


var strava = {

    constructor: function(done) {

        var configPath = "data/strava_config";

        fs.readFile(configPath, {encoding: 'utf-8'}, function(err,data){
            if (!err){
                util.config = JSON.parse(data);
            }else{
                console.log("no 'data/strava_config' file, continuing without...");
            }
        });
    }
};

//run the constructor
strava.constructor();

//assign various api segments to strava object
strava.athlete = athlete;
strava.athletes = athletes;

//and export
module.exports = strava;


/* TODO api functionality
 /v3/oauth
 /v3/athlete
 /v3/athletes/:id
 /v3/activities/:id
 /v3/activities/:id/streams
 /v3/clubs/:id
 /v3/segments/:id
 /v3/segments/:id/leaderboard
 /v3/segments/:id/all_efforts
 /v3/uploads
 */

