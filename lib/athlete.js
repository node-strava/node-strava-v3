/**
 * Created by austin on 9/18/14.
 */

var util = require('./util');

var athlete = {}
    , _qsAllowedProps = [

        //pagination
        'page'
        , 'per_page'

        //listActivities
        , 'before'
        , 'after'
    ]
    , _updateAllowedProps = [
        'city'
        , 'state'
        , 'country'
        , 'sex'
        , 'weight'
    ];

//===== athlete endpoint =====
athlete.get = function(args,done) {

    var endpoint = 'athlete';
    util.getEndpoint(endpoint,args,done);
};
athlete.listFriends = function(args,done) {

    _listHelper('friends',args,done);
};
athlete.listFollowers = function(args,done) {

    _listHelper('followers',args,done);
};
athlete.listActivities = function(args,done) {

    _listHelper('activities',args,done);
};
athlete.listClubs = function(args,done) {

    _listHelper('clubs',args,done);
};
athlete.listRoutes = function(args,done) {

    _listHelper('routes',args,done);
};

athlete.update = function(args,done) {

    var endpoint = 'athlete'
        , form = util.getRequestBodyObj(_updateAllowedProps,args);

    args.form = form;
    util.putEndpoint(endpoint,args,done);
};
//===== athlete endpoint =====

//===== helpers =====
var _listHelper = function(listType,args,done) {

    var endpoint = 'athlete/'
        , qs = util.getQS(_qsAllowedProps,args);

    endpoint += listType + '?' + qs;
    util.getEndpoint(endpoint,args,done);
};
//===== helpers =====

module.exports = athlete;
