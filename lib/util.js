/**
 * Created by austin on 9/18/14.
 */

var request = require('request')
    , querystring = require("querystring");

var util = {};

util.endpointBase = "https://www.strava.com/api/v3/";
util.config = {};

//===== generic get =====
util.getEndpoint = function(endpoint,args,done) {

    if (!args) {
        args = {};
    }

    //all strava requests require an access_token, so let's do that check here
    if (typeof args.access_token === "undefined" && !this.config.access_token) {
        return done({"msg": "you must include an access_token"});
    }
    else if (typeof args.access_token === "undefined") { //add in default access_token, if not overwritten by args
        args.access_token = this.config.access_token;
    }

    var url = this.endpointBase + endpoint
        , options = {
            url: url
            , json: true
            , headers: {
                Authorization: "Bearer " + args.access_token
            }
        };

    request(options, function (err, response, payload) {

        if (!err && response.statusCode == 200) {
            //console.log(payload);
        }
        else {
            console.log('api call error');
            console.log(err);
        }

        done(err, payload);
    });
};

//===== generic post ===== TODO


//===== get pagination query string =====
util.getPaginationQS = function(args) {

    //setup pagination query args
    var page = typeof args.page !== "undefined" ? args.page : null
        , per_page = typeof args.per_page !== "undefined" ? args.per_page : null
        , qa = {}
        , qs;

    if(page)
        qa.page = page;
    if(per_page)
        qa.per_page = per_page;

    qs = querystring.stringify(qa);

    return qs;
};

module.exports = util;
