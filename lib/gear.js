/**
 * Created by austin on 9/22/14.
 */

var util = require('./util');

var gear = {};

gear.get = function(args,done) {

    var endpoint = 'gear/';

    //require gear id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include a gear id'};
        return done(err);
    }

    endpoint += args.id;
    util.getEndpoint(endpoint,args,done);
};

module.exports = gear;
