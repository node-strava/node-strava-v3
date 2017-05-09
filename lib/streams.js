/**
 * Created by austin on 9/24/14.
 */

var streams = function (client) {
  this.client = client;
}

var _qsAllowedProps = [
        'resolution'
        , 'series_type'
    ];

//===== streams endpoint =====
streams.prototype.activity = function(args,done) {

    var endpoint = 'activities';
    this._typeHelper(endpoint,args,done);
};

streams.prototype.effort = function(args,done) {

    var endpoint = 'segment_efforts';
    this._typeHelper(endpoint,args,done);
};

streams.prototype.segment = function(args,done) {

    var endpoint = 'segments';
    this._typeHelper(endpoint,args,done);
};

streams.prototype.route = function(args,done) {

    var endpoint = 'routes';
    this._typeHelper(endpoint,args,done);
};
//===== streams endpoint =====

//===== helpers =====
streams.prototype._typeHelper = function(endpoint,args,done) {

    var err = null
        , qs = this.client.getQS(_qsAllowedProps,args);

    //require id
    if(typeof args.id === 'undefined') {
        err = {'msg':'args must include an id'};
        return done(err);
    }
    //require types
    if(typeof args.types === 'undefined') {
        err = {'msg':'args must include types'};
        return done(err);
    }

    endpoint += '/' + args.id + '/streams/' + args.types + '?' + qs;
    return this.client.getEndpoint(endpoint,args,done);
};
//===== helpers =====

module.exports = streams;
