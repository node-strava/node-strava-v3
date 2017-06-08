/**
 * Created by austin on 9/22/14.
 */

var util = require('./util');

var gear = {};

gear.get = function(args,done) {

    var endpoint = 'gear/';

    //require gear id
    if(typeof args.id === 'undefined') {
        throw new Error('args must include a gear id');
    }

    endpoint += args.id;
    return util.getEndpoint(endpoint,args,done);
};

module.exports = gear;
