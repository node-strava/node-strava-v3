/**
 * Created by austin on 9/22/14.
 */

var gear = function (client) {
  this.client = client;
};

gear.prototype.get = function(args,done) {

    var endpoint = 'gear/';

    //require gear id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include a gear id'};
        return done(err);
    }

    endpoint += args.id;
    return this.client.getEndpoint(endpoint,args,done);
};

module.exports = gear;
