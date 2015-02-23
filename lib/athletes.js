/**
 * Created by austin on 9/19/14.
 */

var util = require('./util')
    ;

var athletes = {};

//===== athletes endpoint =====
athletes.get = function(args,done) {

    this._listHelper('',args,done);
};
athletes.listFriends = function(args,done) {

    this._listHelper('friends',args,done);
};
athletes.listFollowers = function(args,done) {

    this._listHelper('followers',args,done);
};
athletes.stats = function(args, done) {

    this._listHelper('stats',args,done);
};
athletes.listKoms = function(args,done) {

    this._listHelper('koms',args,done);
};
//===== athletes endpoint =====

//===== helpers =====
athletes._listHelper = function(listType,args,done) {

    var endpoint = 'athletes/'
        , err = null
        , qs = util.getPaginationQS(args);

    //require athlete id
    if(typeof args.id === 'undefined') {
        err = {'msg':'args must include an athlete id'};
        return done(err);
    }

    endpoint += args.id + '/' + listType + '?' + qs;
    util.getEndpoint(endpoint,args,done);
};
//===== helpers =====

module.exports = athletes;
