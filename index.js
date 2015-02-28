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
    , segments = require('./lib/segments')
    , segmentEfforts = require('./lib/segmentEfforts')
    , streams = require('./lib/streams')
    , uploads = require('./lib/uploads')
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

//allow environment vars to override config vals
if(process.env.STRAVA_ACCESS_TOKEN)
  util.config.access_token = process.env.STRAVA_ACCESS_TOKEN;
if(process.env.STRAVA_CLIENT_SECRET)
  util.config.client_secret = process.env.STRAVA_CLIENT_SECRET;
if(process.env.STRAVA_CLIENT_ID)
  util.config.client_id = process.env.STRAVA_CLIENT_ID;
if(process.env.STRAVA_REDIRECT_URI)
  util.config.redirect_uri = process.env.STRAVA_REDIRECT_URI;

//assign various api segments to strava object
strava.oauth = oauth;
strava.athlete = athlete;
strava.athletes = athletes;
strava.activities = activities;
strava.clubs = clubs;
strava.gear = gear;
strava.segments = segments;
strava.segmentEfforts = segmentEfforts;
strava.streams = streams;
strava.uploads = uploads;

//and export
module.exports = strava;

