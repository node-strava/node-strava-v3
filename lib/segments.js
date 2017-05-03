/**
 * Created by austin on 9/23/14.
 */

var util = require('./util');

var segments = {}
    , _qsAllowedProps = [

        //pagination
        'page'
        , 'per_page'

        //listSegments
        , 'athlete_id'
        , 'gender'
        , 'age_group'
        , 'weight_class'
        , 'following'
        , 'club_id'
        , 'date_range'
        , 'start_date_local'
        , 'end_date_local'

        //explore
        , 'bounds'
        , 'activity_type'
        , 'min_cat'
        , 'max_cat'
    ]
    , _updateAllowedProps = [
        //star segment
        'starred'
    ];

//===== segments endpoint =====
segments.get = function(args,done) {

    var endpoint = 'segments/'
        , err = null
        , qs = util.getPaginationQS(args);

    //require segment id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an segment id'};
        return done(err);
    }

    endpoint += args.id;
    return util.getEndpoint(endpoint,args,done);
};

segments.listStarred = function(args,done) {

    var qs = util.getQS(_qsAllowedProps,args)
        , endpoint = 'segments/starred?' + qs;

    return util.getEndpoint(endpoint,args,done);
};

segments.starSegment = function(args,done) {

    var endpoint = 'segments/'
        , form = util.getRequestBodyObj(_updateAllowedProps,args)
        , err = null;

    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an segment id'};
        return done(err);
    }

    endpoint += args.id + '/starred';
    args.form = form;

    util.putEndpoint(endpoint,args,done);
};

segments.listEfforts = function(args,done) {

    return _listHelper('all_efforts',args,done);
};

segments.listLeaderboard = function(args,done) {

    return _listHelper('leaderboard',args,done);
};

segments.explore = function(args,done) {

    var qs = util.getQS(_qsAllowedProps,args)
        , endpoint = 'segments/explore?' + qs;

    return util.getEndpoint(endpoint,args,done);
};
//===== segments endpoint =====

//===== helpers =====
var _listHelper = function(listType,args,done) {

    var endpoint = 'segments/'
        , err = null
        , qs = util.getQS(_qsAllowedProps,args);

    //require segment id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include a segment id'};
        return done(err);
    }

    endpoint += args.id + '/' + listType + '?' + qs;
    return util.getEndpoint(endpoint,args,done);
};
//===== helpers =====

module.exports = segments;
