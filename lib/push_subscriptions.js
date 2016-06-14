/**
 * Created by Yousef on 6/14/16.
 */

var util = require('./util');

var push_subscriptions = {}
    , _allowedPostProps = [
        'object_type'
        , 'aspect_type'
        , 'callback_url'
        , 'verify_token'
    ];

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
    util.postEndpoint(endpoint,args,done);
};

push_subscriptions.list = function(args,done) {
    var endpoint = 'push_subscriptions';
    util.getEndpoint(endpoint,args,done);
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
    util.deleteEndpoint(endpoint,args,done);
};

module.exports = push_subscriptions;
