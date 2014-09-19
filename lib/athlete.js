/**
 * Created by austin on 9/18/14.
 */

var util = require("./util");

var athlete = {};

athlete.test = function() {
    console.log(util.config)
};

/**
 * Retrieve athlete associated to access token
 * @param args
 * @param done
 */
athlete.getCurrent = function(args,done) {

    var endpoint = "athlete";
    util.getEndpoint(endpoint,args,done);
};

/**
 * Retrieve athlete by id
 * @param args
 * @param done
 * @returns {*}
 */
athlete.get = function(args,done) {

    var endpoint = "athletes/"
        , err = null;

    if(typeof args.id === 'undefined') {
        err = {"msg":"args must include an athlete 'id'"};
        return done(err);
    }

    endpoint += args.id;
    util.getEndpoint(endpoint,args,done);
};

module.exports = athlete;
