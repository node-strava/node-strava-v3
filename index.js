/**
 * Created by austin on 9/18/14.
 */

var fs = require('fs')

    , util = require('./lib/util')
    , oauth = require('./lib/oauth')
    , athlete = require('./lib/athlete')
    , athletes = require('./lib/athletes')
    , activities = require('./lib/activities')
    , clubs = require('./lib/clubs')
    , gear = require('./lib/gear')
    ;

var strava = {};
var configPath = "data/strava_config";

//attempt to grab the default config
try {
    var config = fs.readFileSync(configPath, {encoding: 'utf-8'});
    util.config = JSON.parse(config);
} catch (err) {
    //console.log(err)
    console.log("no 'data/strava_config' file, continuing without...");
}

//assign various api segments to strava object
strava.oauth = oauth;
strava.athlete = athlete;
strava.athletes = athletes;
strava.activities = activities;
strava.clubs = clubs;
strava.gear = gear;

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

