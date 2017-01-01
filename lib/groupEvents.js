/**
 * Created by ozqu on 1/1/2017
 */

var util = require('./util');

var groupEvents = {};

//===== group_events endpoint =====
groupEvents.get = function(args,done) {

    var endpoint = 'group_events/'
        , err = null;

    //require segment id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include an group_event id'};
        return done(err);
    }

    endpoint += args.id;
    util.getEndpoint(endpoint,args,done);
};
groupEvents.joinGroupEvent = function(args,done) {

    var endpoint = 'group_events/'
        , err = null;

    //require group event id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include a group_event id'};
        return done(err);
    }

    endpoint += args.id + '/rsvps';

    args.body = {};
    util.postEndpoint(endpoint,args,done);
};
groupEvents.leaveGroupEvent = function(args,done) {

    var endpoint = 'group_events/'
        , err = null;

    //require group event id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include a group_event id'};
        return done(err);
    }

    endpoint += args.id + '/rsvps';
    util.deleteEndpoint(endpoint,args,done);
};
groupEvents.listAthletes = function(args,done) {

    var endpoint = 'group_events/'
        , err = null
        , qs = util.getPaginationQS(args);

    //require group event id
    if(typeof args.id === 'undefined') {
        err = {msg:'args must include a group_event id'};
        return done(err);
    }

    endpoint += args.id + '/athletes?' + qs;
    util.getEndpoint(endpoint,args,done);
};
//===== group_events endpoint =====

module.exports = groupEvents;
