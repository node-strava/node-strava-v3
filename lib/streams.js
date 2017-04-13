/**
 * Created by austin on 9/24/14.
 */

var util = require('./util');

var streams = {}
    , _qsAllowedProps = [
        'resolution'
        , 'series_type'
    ];

//===== streams endpoint =====
streams.activity = function(args,done) {

    var endpoint = 'activities';
    _typeHelper(endpoint,args,done);
};

streams.effort = function(args,done) {

    var endpoint = 'segment_efforts';
    _typeHelper(endpoint,args,done);
};

streams.segment = function(args,done) {

    var endpoint = 'segments';
    _typeHelper(endpoint,args,done);
};

streams.route = function(args,done) {

    var endpoint = 'routes';
    _typeHelper(endpoint,args,done);
};
//===== streams endpoint =====

//===== helpers =====
var _typeHelper = function(endpoint,args,done) {

    var err = null
        , qs = util.getQS(_qsAllowedProps,args);

    //require id
    if(typeof args.id === 'undefined') {
        err = {'msg':'args must include an id'};
        return done(err);
    }
    //require types
    if(typeof args.types === 'undefined') {
        err = {'msg':'args must include types'};
        return done(err);
    }

    endpoint += '/' + args.id + '/streams/' + args.types + '?' + qs;
    util.getEndpoint(endpoint,args,done);
};
//===== helpers =====

module.exports = streams;
