/**
 * Created by austin on 9/23/14.
 */

var segmentEfforts = function (client) {
  this.client = client;
};

//===== segment_efforts endpoint =====
segmentEfforts.prototype.get = function(args,done) {

    var endpoint = 'segment_efforts/'
        , err = null;

    //require segment id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include a segment id'};
        return done(err);
    }

    endpoint += args.id;
    return this.client.getEndpoint(endpoint,args,done);
};
//===== segment_efforts endpoint =====

module.exports = segmentEfforts;
