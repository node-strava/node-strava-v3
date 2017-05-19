/**
 * Created by dhritzkiv on 9/20/14.
 */

var routes = function (client) {
  this.client = client;
};

var _qsAllowedProps = [];

//===== routes endpoint =====
routes.prototype.get = function(args,done) {

    var endpoint = 'routes/'
        , err = null
        , qs = this.client.getQS(_qsAllowedProps,args);

    //require route id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an route id'};
        return done(err);
    }

    endpoint += args.id + '?' + qs;
    return this.client.getEndpoint(endpoint,args,done);
};
//===== routes endpoint =====

module.exports = routes;
