/**
 * Created by Yousef on 6/14/16.
 */

var util = require('./util')
    , authenticator = require('./authenticator')
    , querystring = require('querystring');

var push_subscriptions = {}
    , _allowedPostProps = [
        'object_type'
        , 'aspect_type'
        , 'callback_url'
        , 'verify_token'
    ];
    
push_subscriptions.endpointBase = 'https://api.strava.com/api/v3/';

push_subscriptions.post = function(args,done) {
    var endpoint = 'push_subscriptions';
    var err = null;

    
    //various requirements
    if(
        typeof args.object_type === 'undefined' || typeof args.aspect_type == 'undefined' || typeof args.callback_url == 'undefined'
        ) {

        err = {'msg':'args must include both object_type, aspect_type, callback_url'};
        return done(err);
    }

    args.body = util.getRequestBodyObj(_allowedPostProps,args);
    this._postEndpoint(endpoint,args,done);
};

push_subscriptions.list = function(args,done) {
    var endpoint = 'push_subscriptions';
    args.client_secret = authenticator.getClientSecret();
    args.client_id = authenticator.getClientId();
    
    var qs = qs = util.getQS(["client_secret", "client_id"],args);
    endpoint += '?' + qs;
    this._getEndpoint(endpoint,args,done);
};

push_subscriptions.delete = function(args,done) {

    var endpoint = 'push_subscriptions/'
        , err = null;

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include a push subscription id'};
        return done(err);
    }

    endpoint += args.id;
    
    args.client_secret = authenticator.getClientSecret();
    args.client_id = authenticator.getClientId();
    
    var qs = qs = util.getQS(["client_secret", "client_id"],args);
    endpoint += '?' + qs;
    this._deleteEndpoint(endpoint,args,done);
};

push_subscriptions._postEndpoint = function(endpoint,args,done) {
    if (!args) {
        args = {};
    }

    args.body.client_secret = authenticator.getClientSecret();
    args.body.client_id = authenticator.getClientId();
    
    var url = this.endpointBase + endpoint
        , options = {
            url: url
            , method: 'POST'
            , form: args.body
        };

    util._requestHelper(options,done);
};

push_subscriptions._getEndpoint = function(endpoint,args,done) {

    if (!args) {
        args = {};
    }

    var url = this.endpointBase + endpoint
        , options = {
            url: url
            , json: true
        };

    util._requestHelper(options,done);
};

push_subscriptions._deleteEndpoint = function(endpoint,args,done) {
   if (!args) {
        args = {};
    }

    if (!args.body) {
        args.body = {};
    }
    
    args.body.client_secret = authenticator.getClientSecret();
    args.body.client_id = authenticator.getClientId();
    
    var url = this.endpointBase + endpoint
        , options = {
            url: url
            , method: 'DELETE'
        };

    util._requestHelper(options,done);
};


module.exports = push_subscriptions;
