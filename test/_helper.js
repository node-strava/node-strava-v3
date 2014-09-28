/**
 * Created by austin on 9/27/14.
 */

var strava = require('../');

var testsHelper = {};

testsHelper.getSampleAthlete = function(done) {
    strava.athlete.get({},function(err,payload) {

        done(err,payload);
    });
};

testsHelper.getSampleActivity = function(done) {
    strava.athlete.listActivities({},function(err,payload) {

        done(err,payload[0]);
    });
};

module.exports = testsHelper;
