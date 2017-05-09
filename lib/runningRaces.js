/**
 * Created by ozqu on 12/31/16.
 */

var runningRaces = function (client) {
  this.client = client;
}

var _qsAllowedProps = [
        'year'
    ];

//===== running_races endpoint =====
runningRaces.prototype.get = function(args,done) {
    var endpoint = 'running_races/'
        , err = null;

    //require running race id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an race id'};
        return done(err);
    }

    endpoint += args.id;
    return this.client.getEndpoint(endpoint,args,done);
};

runningRaces.prototype.listRaces = function(args,done) {
    var qs = this.client.getQS(_qsAllowedProps,args)
        , endpoint = 'running_races?' + qs;

    return this.client.getEndpoint(endpoint,args,done);
};

//===== running_races endpoint =====
module.exports = runningRaces;
