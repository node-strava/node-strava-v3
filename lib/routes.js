/**
 * Created by dhritzkiv on 9/20/14.
 */

var util = require('./util')
    ;

var routes = {}
    , _qsAllowedProps = [];

//===== routes endpoint =====
routes.get = function(args,done) {

    var endpoint = 'routes/'
        , err = null
        , qs = util.getQS(_qsAllowedProps,args);

    //require route id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an route id'};
        return done(err);
    }

    endpoint += args.id + '?' + qs;
    util.getEndpoint(endpoint,args,done);
};
//===== routes endpoint =====

module.exports = routes;
