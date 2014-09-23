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
    util.getEndpoint(endpoint,args,done);
};
clubs.listMembers = function(args,done) {

    this._listHelper('members',args,done);
};
clubs.listActivities = function(args,done) {

    this._listHelper('activities',args,done);
};
//===== clubs endpoint =====

//===== helpers =====
clubs._listHelper = function(listType,args,done) {

    var endpoint = 'clubs/'
        , err = null
        , qs = util.getPaginationQS(args);

    //require club id
    if(typeof args.id === 'undefined') {
        err = {'msg':'args must include a club id'};
        return done(err);
    }

    endpoint += args.id + '/' + listType + '?' + qs;

    util.getEndpoint(endpoint,args,done);
};
//===== helpers =====


module.exports = clubs;
