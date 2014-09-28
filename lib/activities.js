/**
 * Created by austin on 9/20/14.
 */

var util = require('./util')
    ;

var activities = {}
    , _qsAllowedProps = [

        //pagination
        'page'
        , 'per_page'

        //getSegment
        , 'include_all_efforts'
    ]
    , _createAllowedProps = [
        'name'
        , 'type'
        , 'start_date_local'
        , 'elapsed_time'
        , 'description'
        , 'distance'
    ]
    , _updateAllowedProps = [
        'name'
        , 'type'
        , 'commute'
        , 'trainer'
        , 'description'
        , 'gear_id'
    ];

//===== activities endpoint =====
activities.get = function(args,done) {

    var endpoint = 'activities/'
        , err = null
        , qs = util.getQS(_qsAllowedProps,args);

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id + '?' + qs;
    util.getEndpoint(endpoint,args,done);
};
activities.create = function(args,done) {

    var endpoint = 'activities';

    args.body = util.getRequestBodyObj(_createAllowedProps,args);
    util.postEndpoint(endpoint,args,done);
};
activities.update = function(args,done) {

    var endpoint = 'activities/'
        , form = util.getRequestBodyObj(_updateAllowedProps,args)
        , err = null;

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id;

    args.form = form;

    util.putEndpoint(endpoint,args,done);
};
activities.delete = function(args,done) {

    var endpoint = 'activities/'
        , err = null;

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id;
    util.deleteEndpoint(endpoint,args,done);
};
activities.listFriends = function(args,done) {

    var endpoint = 'activities/following/';
    this._listHelper(endpoint,args,done);
};
activities.listZones = function(args,done) {

    var endpoint = 'activities/'
        , err = null;

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id + '/zones';

    this._listHelper(endpoint,args,done);
};
activities.listLaps = function(args,done) {

    var endpoint = 'activities/'
        , err = null;

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id + '/laps';

    this._listHelper(endpoint,args,done);
};
activities.listComments = function(args,done) {

    var endpoint = 'activities/'
        , err = null;

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id + '/comments';

    this._listHelper(endpoint,args,done);
};
activities.listKudos = function(args,done) {

    var endpoint = 'activities/'
        , err = null;

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id + '/kudos';

    this._listHelper(endpoint,args,done);
};
activities.listPhotos = function(args,done) {

    var endpoint = 'activities/'
        , err = null;

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id + '/photos';

    this._listHelper(endpoint,args,done);
};
//===== activities endpoint =====

//===== helpers =====
activities._listHelper = function(endpoint,args,done) {

    var qs = util.getPaginationQS(args);

    endpoint +=  '?' + qs;
    util.getEndpoint(endpoint,args,done);
};
//===== helpers =====

module.exports = activities;
