/**
 * Created by austin on 9/20/14.
 */


var activities = function (client) {
  this.client = client;
};

var  _qsAllowedProps = [

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
        , 'private'
    ]
    , _updateAllowedProps = [
        'name'
        , 'type'
        , 'private'
        , 'commute'
        , 'trainer'
        , 'description'
        , 'gear_id'
    ];

//===== activities endpoint =====
activities.prototype.get = function(args,done) {

    var endpoint = 'activities/'
        , err = null
        , qs = this.client.getQS(_qsAllowedProps,args);

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id + '?' + qs;
    return this.client.getEndpoint(endpoint,args,done);
};
activities.prototype.create = function(args,done) {

    var endpoint = 'activities';

    args.body = this.client.getRequestBodyObj(_createAllowedProps,args);
    return this.client.postEndpoint(endpoint,args,done);
};
activities.prototype.update = function(args,done) {

    var endpoint = 'activities/'
        , form = this.client.getRequestBodyObj(_updateAllowedProps,args)
        , err = null;

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id;

    args.form = form;

    return this.client.putEndpoint(endpoint,args,done);
};
activities.prototype.delete = function(args,done) {

    var endpoint = 'activities/'
        , err = null;

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id;
    return this.client.deleteEndpoint(endpoint,args,done);
};
activities.prototype.listFriends = function(args,done) {

    var endpoint = 'activities/following/';
    return this._listHelper(endpoint,args,done);
};
activities.prototype.listZones = function(args,done) {

    var endpoint = 'activities/'
        , err = null;

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id + '/zones';

    return this._listHelper(endpoint,args,done);
};
activities.prototype.listLaps = function(args,done) {

    var endpoint = 'activities/'
        , err = null;

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id + '/laps';

    return this._listHelper(endpoint,args,done);
};
activities.prototype.listComments = function(args,done) {

    var endpoint = 'activities/'
        , err = null;

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id + '/comments';

    return this._listHelper(endpoint,args,done);
};
activities.prototype.listKudos = function(args,done) {

    var endpoint = 'activities/'
        , err = null;

    //require activity id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id + '/kudos';

    return this._listHelper(endpoint,args,done);
};
activities.prototype.listPhotos = function(args,done) {

    var endpoint = 'activities/'
        , err = null;

    //require activity id
    if (typeof args.id === 'undefined') {
        err = { msg: 'args must include an activity id' };
        return done(err);
    }

    endpoint += args.id + '/photos';

    var pageQS = this.client.getPaginationQS(args);

    var completeQS = pageQS;

    // should be true according to Strava API docs
    args.photo_sources = true;
    var argsQS = this.client.getQS(['size', 'photo_sources'], args);

    if (completeQS && completeQS.length) {
        completeQS += '&';
    }
    completeQS += argsQS;

    endpoint += '?' + completeQS;

    return this.client.getEndpoint(endpoint, args, done);
};
activities.prototype.listRelated = function(args,done) {

    var endpoint = 'activities/'
        , err = null;

    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an activity id'};
        return done(err);
    }

    endpoint += args.id + '/related';

    return this._listHelper(endpoint,args,done);
};
//===== activities endpoint =====

//===== helpers =====
activities.prototype._listHelper = function(endpoint,args,done) {

    var qs = this.client.getPaginationQS(args);

    endpoint +=  '?' + qs;
    return this.client.getEndpoint(endpoint,args,done);
};
//===== helpers =====

module.exports = activities;
