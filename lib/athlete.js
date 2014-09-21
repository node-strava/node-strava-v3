/**
 * Created by austin on 9/18/14.
 */

var util = require("./util")
    ;

var athlete = {};

//===== athlete endpoint =====
athlete.get = function(args,done) {

    var endpoint = "athlete";
    util.getEndpoint(endpoint,args,done);
};
athlete.listFriends = function(args,done) {

    this._listHelper("friends",args,done);
};
athlete.listFollowers = function(args,done) {

    this._listHelper("followers",args,done);
};

athlete.update = function(args,done) {

    var endpoint = "athlete"
        , body = this._putHelper(args);

    args.body = body;
    util.putEndpoint(endpoint,args,done);
};
//===== athlete endpoint =====

//===== helpers =====
athlete._listHelper = function(listType,args,done) {

    var endpoint = "athlete/"
        , err = null
        , qs = util.getPaginationQS(args);

    endpoint += listType + '?' + qs;
    util.getEndpoint(endpoint,args,done);
};
athlete._putHelper = function(args) {

    var body = {}
        , allowedProps = [
            "city"
            , "state"
            , "country"
            , "sex"
            , "weight"
        ];

    for(var i = 0; i < allowedProps.length; i++) {
        if(args[allowedProps[i]])
            body[allowedProps[i]] = args[allowedProps[i]];
    }

    return body;
};
//===== helpers =====

module.exports = athlete;
