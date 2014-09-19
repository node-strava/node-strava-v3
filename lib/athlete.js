/**
 * Created by austin on 9/18/14.
 */

var util = require("./util")
    ;

var athlete = {};

//===== athlete endpoint =====
athlete.getCurrent = function(args,done) {

    var endpoint = "athlete";
    util.getEndpoint(endpoint,args,done);
};
athlete.listCurrentFriends = function(args,done) {

    var qs = util.getPaginationQS(args)
        , endpoint = "athlete/friends" + "?" + qs;

    util.getEndpoint(endpoint,args,done);
};
athlete.listCurrentFollowers = function(args,done) {

    var qs = util.getPaginationQS(args)
        , endpoint = "athlete/followers" + "?" + qs;

    util.getEndpoint(endpoint,args,done);
};
//===== athlete endpoint =====

//===== athletes endpoint =====
athlete.get = function(args,done) {

    this._listHelper("",args,done);
};
athlete.listFriends = function(args,done) {

    this._listHelper("friends",args,done);
};
athlete.listFollowers = function(args,done) {

    this._listHelper("followers",args,done);
};
athlete.getKoms = function(args,done) {

    this._listHelper("koms",args,done);
};
//===== athletes endpoint =====

//===== helpers =====
athlete._listHelper = function(listType,args,done) {

    var endpoint = "athletes/"
        , err = null
        , qs = util.getPaginationQS(args);

    //require athlete id
    if(typeof args.id === 'undefined') {
        err = {"msg":"args must include an athlete 'id'"};
        return done(err);
    }

    endpoint += args.id + '/' + listType + '?' + qs;
    util.getEndpoint(endpoint,args,done);
};
//===== helpers =====

module.exports = athlete;
