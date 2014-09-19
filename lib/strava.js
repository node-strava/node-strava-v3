/**
 * Created by austin on 9/17/14.
 */

var request = require('request')
    , fs = require('fs')
    , util = require('./lib/util');

//request.debug = true

var config = {};
var endpointBase = "https://www.strava.com/api/v3/";

var strava = {};

strava.constructor = function() {

    var configPath = "data/strava_config.json";

    fs.readFile(configPath, {encoding: 'utf-8'}, function(err,data){
        if (!err){
            //console.log('received data: ' + data);
            config = JSON.parse(data);
        }else{
            console.log("no data/strava_config.json file, continuing without...");
        }
    });
};

/**
 *
 * @param args
 * @constructor
 */
function Strava(args) {

    var args = typeof args === "undefined" ? {} : args
        , configPath = args.configPath ? args.configPath : "data/strava_config.json"
        ;

    fs.readFile(configPath, {encoding: 'utf-8'}, function(err,data){
        if (!err){
            //console.log('received data: ' + data);
            config = JSON.parse(data);
        }else{
            console.log("no data/strava_config.json file, continuing without...");
        }
    });
}

//===== generic get =====

//===== generic post =====

//===== convenience methods =====

strava.getCurrentAthlete = function(args,done) {

    var endpoint = endpointBase + "athlete";
    this._getEndpoint(endpoint,args,done);
};

strava.getAthlete = function(args,done) {

    var endpoint = endpointBase + "athletes/"
        , err = null;

    if(typeof args.id === 'undefined') {
        err = {"msg":"args must include an athlete 'id'"};
        return done(err);
    }

    endpoint += args.id;
    this._getEndpoint(endpoint,args,done);
};

Strava.prototype._getEndpoint = function(endpoint,args,done) {

    if(!args) {
        args = {};
    }

    //all strava requests require an access_token, so let's do that check here
    if(typeof args.access_token === "undefined" && !config.access_token) {
        return done({"msg": "you must include an access_token"});
    }
    else if (typeof args.access_token === "undefined") { //add in default access_token, if not overwritten by args
        args.access_token = config.access_token;
    }

    var options = {
        url: endpoint
        , json: true
        , headers: {
            Authorization:"Bearer " + args.access_token
        }
    };

    request(options, function (err, response, payload) {

        if (!err && response.statusCode == 200) {
            console.log(payload);
        }
        else {
            console.log('api call error');
            console.log(err);
        }

        done(err,payload);
    });
};

strava.constructor();
module.exports = strava;


