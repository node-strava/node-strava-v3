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
activities.get = function(args,done) {

    var qs = util.getQS(_qsAllowedProps,args);

    _requireActivityId(args)

    var endpoint = 'activities/' + args.id + '?' + qs;
    return util.getEndpoint(endpoint,args,done);
};
activities.create = function(args,done) {

    var endpoint = 'activities';

    args.body = util.getRequestBodyObj(_createAllowedProps,args);
    return util.postEndpoint(endpoint,args,done);
};
activities.update = function(args,done) {

    var form = util.getRequestBodyObj(_updateAllowedProps,args);

    _requireActivityId(args);

    var endpoint = 'activities/' + args.id;

    args.form = form;

    return util.putEndpoint(endpoint,args,done);
};
activities.delete = function(args,done) {

    _requireActivityId(args);

    var endpoint = 'activities/' + args.id;

    return util.deleteEndpoint(endpoint,args,done);
};
activities.listFriends = function(args,done) {

    var endpoint = 'activities/following/';
    return _listHelper(endpoint,args,done);
};
activities.listZones = function(args,done) {

    _requireActivityId(args);

    var endpoint = 'activities/' + args.id + '/zones';

    return _listHelper(endpoint,args,done);
};
activities.listLaps = function(args,done) {

    _requireActivityId(args);

    var endpoint = 'activities/' + args.id + '/laps';

    return _listHelper(endpoint,args,done);
};
activities.listComments = function(args,done) {

    _requireActivityId(args);

    var endpoint = 'activities/'+ args.id + '/comments';

    return _listHelper(endpoint,args,done);
};
activities.listKudos = function(args,done) {

    _requireActivityId(args)

    var endpoint = 'activities/' + args.id + '/kudos';

    return _listHelper(endpoint,args,done);
};
activities.listPhotos = function(args,done) {

    _requireActivityId(args);

    endpoint = 'activities/' + args.id + '/photos';

    var pageQS = util.getPaginationQS(args);

    var completeQS = pageQS;

    // should be true according to Strava API docs
    args.photo_sources = true;
    var argsQS = util.getQS(['size', 'photo_sources'], args);

    if (completeQS && completeQS.length) {
        completeQS += '&';
    }
    completeQS += argsQS;

    endpoint += '?' + completeQS;

    return util.getEndpoint(endpoint, args, done);
};
activities.listRelated = function(args,done) {

    _requireActivityId(args);

    endpoint = 'activities/' + args.id + '/related';

    return _listHelper(endpoint,args,done);
};
//===== activities endpoint =====

//===== helpers =====
var _requireActivityId = function(args) {
    if (typeof args.id === 'undefined') {
        throw new Error('args must include an activity id')
    }
}

var _listHelper = function(endpoint,args,done) {

    var qs = util.getPaginationQS(args);

    endpoint +=  '?' + qs;
    return util.getEndpoint(endpoint,args,done);
};
//===== helpers =====

module.exports = activities;
