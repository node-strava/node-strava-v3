/**
 * Created by austin on 9/22/14.
 */

var util = require('./util');

var clubs = {};

//===== clubs endpoint =====
clubs.get = function(args,done) {

    var endpoint = 'clubs/';

    //require club id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include a club id'};
        return done(err);
    }

    endpoint += args.id;
    return util.getEndpoint(endpoint,args,done);
};
clubs.listMembers = function(args,done) {

    return _listHelper('members',args,done);
};
clubs.listActivities = function(args,done) {

    return _listHelper('activities',args,done);
};
clubs.listAnnouncements = function(args,done) {

    return _listHelper('announcements',args,done);
};
clubs.listEvents = function(args,done) {

    return _listHelper('group_events',args,done);
};
clubs.listAdmins = function(args,done) {

    return _listHelper('admins',args,done);
};
clubs.joinClub = function(args,done) {

    return _listHelper('join',args,done);
};
clubs.leaveClub = function(args,done) {

    return _listHelper('leave',args,done);
};
//===== clubs endpoint =====

//===== helpers =====
var _listHelper = function(listType,args,done) {

    var endpoint = 'clubs/'
        , err = null
        , qs = util.getPaginationQS(args);

    //require club id
    if(typeof args.id === 'undefined') {
        err = {'msg':'args must include a club id'};
        return done(err);
    }

    endpoint += args.id + '/' + listType + '?' + qs;

    return util.getEndpoint(endpoint,args,done);
};
//===== helpers =====


module.exports = clubs;
