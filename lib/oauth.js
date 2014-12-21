/**
 * Created by austin on 9/22/14.
 */

var util = require('./util')
    , request = require('request')
    , querystring = require('querystring');

var oauth = {};

oauth.getRequestAccessURL = function(args) {

    var url = 'https://www.strava.com/oauth/authorize?'
        , oauthArgs = {
            client_id: util.config.client_id
            , redirect_uri: util.config.redirect_uri
            , response_type: 'code'
        };

    if(args.scope)
        oauthArgs.scope = args.scope;
    if(args.state)
        oauthArgs.state = args.state;
    if(args.approval_prompt)
        oauthArgs.approval_prompt = args.approval_prompt;


    var qs = querystring.stringify(oauthArgs);

    url += qs;
    return url;
};

oauth.getToken = function(code,done) {

    var endpoint = 'oauth/token'
        , args = {}
        , form = {
            code: code
            , client_secret: util.config.client_secret
            , client_id: util.config.client_id
        };

    args.form = form;
    util.postEndpoint(endpoint,args,done);
};

oauth.deauthorize = function(args,done) {

    var endpoint = 'https://www.strava.com/oauth/deauthorize';

    var url = endpoint
        , options = {
            url: url
            , method: 'POST'
            , json: true
            , headers: {
                Authorization: 'Bearer ' + args.access_token
            }
        };

    request(options, function (err, response, payload) {

        if (!err) {
            //console.log(payload);
        }
        else {
            console.log('api call error');
            console.log(err);
        }

        done(err, payload);
    });
};

module.exports = oauth;
