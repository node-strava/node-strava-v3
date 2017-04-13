/**
 * Created by ozqu on 12/31/16.
 */

var util = require('./util');

var runningRaces= {}
    , _qsAllowedProps = [
        'year'
    ];

//===== running_races endpoint =====
runningRaces.get = function(args,done) {
    var endpoint = 'running_races/'
        , err = null;

    //require running race id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an race id'};
        return done(err);
    }

    endpoint += args.id;
    util.getEndpoint(endpoint,args,done);
};

runningRaces.listRaces = function(args,done) {
    var qs = util.getQS(_qsAllowedProps,args)
        , endpoint = 'running_races?' + qs;

    util.getEndpoint(endpoint,args,done);
};

//===== running_races endpoint =====
module.exports = runningRaces;
