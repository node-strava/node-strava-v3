/**
 * Created by austin on 9/18/14.
 */

var fs = require('fs')
    , HttpClient = require('./lib/httpClient')
    , oauth = require('./lib/oauth')
    , authenticator = require('./lib/authenticator')

    , Athlete = require('./lib/athlete')
    , Athletes = require('./lib/athletes')
    , Activities = require('./lib/activities')
    , Clubs = require('./lib/clubs')
    , Gear = require('./lib/gear')
    , Segments = require('./lib/segments')
    , SegmentEfforts = require('./lib/segmentEfforts')
    , Streams = require('./lib/streams')
    , Uploads = require('./lib/uploads')
    , rateLimiting = require('./lib/rateLimiting')
    , RunningRaces = require('./lib/runningRaces')
    , Routes = require('./lib/routes')

    , request = require('request-promise')
    , version = require('./package').version
    ;

var strava = {};

strava.defaultRequest = request.defaults({
  baseUrl : 'https://www.strava.com/api/v3/',
  headers: {
    'User-Agent': 'node-strava-v3 v'+version
  },
  json: true
});




strava.client = function (token,request) {
  this.access_token = token;

  this.request = request || strava.defaultRequest;

  this.request = this.request.defaults({
    'Authorization' : 'Bearer '+this.access_token
  })

  var httpClient = new HttpClient(this.request);

  this.athlete = new Athlete(httpClient);
  this.athletes =new Athletes(httpClient);
  this.activities = new Activities(httpClient);
  this.clubs = new Clubs(httpClient);
  this.gear = new Gear(httpClient);
  this.segments = new Segments(httpClient);
  this.segmentEfforts = new SegmentEfforts(httpClient);
  this.streams = new Streams(httpClient);
  this.uploads = new Uploads(httpClient);
  this.rateLimiting = rateLimiting;
  this.runningRaces = new RunningRaces(httpClient);
  this.routes = new Routes(httpClient);
}

// XXX Not working currently because getToken() will get
// called and set the httpClient, making it too late for this to take effect
// strava.config = authenticator.fetchConfig;

strava.oauth = oauth;

// The original behavior was to use global configuration.
strava.defaultHttpClient = new HttpClient(strava.defaultRequest.defaults({
  headers: {
    'Authorization' : 'Bearer '+authenticator.getToken()
  }
}));

strava.athlete = new Athlete(strava.defaultHttpClient);
strava.athletes =new Athletes(strava.defaultHttpClient);
strava.activities = new Activities(strava.defaultHttpClient);
strava.clubs = new Clubs(strava.defaultHttpClient);
strava.gear = new Gear(strava.defaultHttpClient);
strava.segments = new Segments(strava.defaultHttpClient);
strava.segmentEfforts = new SegmentEfforts(strava.defaultHttpClient);
strava.streams = new Streams(strava.defaultHttpClient);
strava.uploads = new Uploads(strava.defaultHttpClient);
strava.rateLimiting = rateLimiting;
strava.runningRaces = new RunningRaces(strava.defaultHttpClient);
strava.routes = new Routes(strava.defaultHttpClient);



//and export
module.exports = strava;

