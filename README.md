
# strava-v3: Simple Node wrapper for Strava's v3 API

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]

[npm-image]: https://img.shields.io/npm/v/strava-v3.svg?style=flat
[npm-url]: https://npmjs.org/package/strava-v3
[downloads-image]: https://img.shields.io/npm/dm/strava-v3.svg?style=flat
[downloads-url]: https://npmjs.org/package/strava-v3
[travis-image]: https://travis-ci.org/UnbounDev/node-strava-v3.svg?branch=master&style=flat
[travis-url]: https://travis-ci.org/UnbounDev/node-strava-v3

### Status

Supports many but not all Strava API endpoints:

* `oauth`
* `athlete`
* `athletes`
* `activities`
* `clubs`
* `gear`
* `running_races`
* `routes`
* `segments`
* `segment_efforts`
* `streams`
* `uploads`

## Installation

```bash
npm install strava-v3
```

## Import syntax
Importing only the library:
```
import strava from 'strava-v3';
```
Importing both the library as well as interfaces:
```
import { default as strava, Strava } from 'strava-v3';
```

## Quick start

* Create an application at [strava.com/settings/api](https://www.strava.com/settings/api) and make note of your `access_token`

### Promise API

```js
const strava = require('strava-v3')
strava.config({...})
const payload = await strava.athlete.get({})
console.log(payload)
```

### Callback API (Deprecated)

```js
const strava = require('strava-v3');
strava.athlete.get({},function(err,payload,limits) {
    if(!err) {
        console.log(payload);
    }
    else {
        console.log(err);
    }
});
```

## Usage

### OAuth configuration

If you are writing an app that other Strava users will authorize against their
own account, you'll need to use the OAuth flow. This requires that you provide
a `client_id`, `client_secret` and `redirect_uri` that ultimately result in
getting back an `access_token` which can be used for calls on behalf of that
user.

You have three options to configure your OAuth calls:

#### Explicit configuration

Use explicit configuration, which will override both the config file and the environment variables:

```js
var strava = require('strava-v3')
strava.config({
  "access_token"  : "Your apps access token (Required for Quickstart)",
  "client_id"     : "Your apps Client ID (Required for oauth)",
  "client_secret" : "Your apps Client Secret (Required for oauth)",
  "redirect_uri"  : "Your apps Authorization Redirection URI (Required for oauth)",
});
```
##### Environment variables

You may alternatively supply the values via environment variables named following the convention `STRAVA_<keyName>`, so

- `STRAVA_ACCESS_TOKEN` = `access_token`
- `STRAVA_CLIENT_ID` = `client_id`
- `STRAVA_CLIENT_SECRET` = `client_secret`
- `STRAVA_REDIRECT_URI` = `redirect_uri`


#### Config File (Deprecated)

The template `strava_config` file can be found at the modules root directory and has the following structure

```json
{
  "access_token"  : "Your apps access token (Required for Quickstart)",
  "client_id"     : "Your apps Client ID (Required for oauth)",
  "client_secret" : "Your apps Client Secret (Required for oauth)",
  "redirect_uri"  : "Your apps Authorization Redirection URI (Required for oauth)",
}
```

### General

API access is designed to be as closely similar in layout as possible to Strava's own architecture, with the general call definition being

```js
var strava = require('strava-v3')

// Promise API
strava.<api endpoint>.<api endpoint option>(args)

// Callback API
strava.<api endpoint>.<api endpoint option>(args,callback)
```

Example usage:

```js
var strava = require('strava-v3');
strava.athletes.get({id:12345},function(err,payload,limits) {
    //do something with your payload, track rate limits
});
```

### Overriding the default `access_token`

You'll may want to use OAuth `access_token`s on behalf of specific users once
your app is in production. Using an `access_token` specific to a validated user
allows for detailed athlete information, as well as the option for additional
`PUT`/`POST`/`DELETE` privileges.

Use app-specific logic to retrieve the `access\_token` for a particular user, then create a Strava client for that user, with their token:

```js
const stravaApi = require('strava-v3');

// ... get access_token from somewhere
strava = new stravaApi.client(access_token);

const payload = await strava.athlete.get({})
```

Less conveniently, you can also explictly pass an `access_token` to API calls:

Example usage:

```js
const strava = require('strava-v3');
const payload = await strava.athlete.get({'access_token':'abcde'})
```

### Dealing with pagination

For those API calls that support pagination, you can control both the `page` being retrieved and the number of responses to return `per_page` by adding the corresponding properties to `args`.

Example usage:

```js
const strava = require('strava-v3');
const payload = await strava.athlete.listFollowers({
    page: 1,
    per_page: 2
});
```

### Uploading files
To upload a file you'll have to pass in the `data_type` as specified in Strava's API reference as well as a string `file` designating the `<filepath>/<filename>`. If you want to get updates on the status of your upload pass in `statusCallback` along with the rest of your `args` - the wrapper will check on the upload once a second until complete.

Example usage:

```js
const strava = require('strava-v3');
const payload = await strava.uploads.post({
    data_type: 'gpx',
    file: 'data/your_file.gpx',
    name: 'Epic times',
    statusCallback: (err,payload) => {
        //do something with your payload
    }
});
```

### Rate limits
According to Strava's API each response contains information about rate limits.
For more details see: [Rate Limiting](https://developers.strava.com/docs/#rate-limiting)

Returns `null` if `X-Ratelimit-Limit` or `X-RateLimit-Usage` headers are not provided

#### Global status

In our promise API, only the response body "payload" value is returned as a
[Bluebird promise](https://bluebirdjs.com/docs/api-reference.html). To track
rate limiting we use a global counter accessible through `strava.rateLimiting`.
 The rate limiting status is updated with each request.


    // returns true if the most recent request exceeded the rate limit
    strava.rateLimiting.exceeded()

    // returns the current decimal fraction (from 0 to 1) of rate used. The greater of the short and long term limits.
    strava.rateLimiting.fractionReached();

#### Callback interface (Rate limits)

```js
const strava = require('strava-v3');
strava.athlete.get({'access_token':'abcde'},function(err,payload,limits) {
    //do something with your payload, track rate limits
    console.log(limits);
    /*
    output:
    {
       shortTermUsage: 3,
       shortTermLimit: 600,
       longTermUsage: 12,
       longTermLimit: 30000
    }
    */
});
```
### Supported API Endpoints

To used the Promise-based API, do not provide a callback. A promise will be returned.

See Strava API docs for returned data structures.

#### OAuth

* `strava.oauth.getRequestAccessURL(args)`
* `strava.oauth.getToken(code,done)` (Used to token exchange)
* `strava.oauth.refreshToken(code)` (Callback API not supported)
* `strava.oauth.deauthorize(args,done)`

#### Athlete

* `strava.athlete.get(args,done)`
* `strava.athlete.update(args,done)` // only 'weight' can be updated.
* `strava.athlete.listActivities(args,done)` *Get list of activity summaries*
* `strava.athlete.listRoutes(args,done)`
* `strava.athlete.listClubs(args,done)`
* `strava.athlete.listZones(args,done)`

#### Athletes

* `strava.athletes.get(args,done)` *Get a single activity. args.id is required*
* `strava.athletes.stats(args,done)`

#### Activities

* `strava.activities.get(args,done)`
* `strava.activities.create(args,done)`
* `strava.activities.update(args,done)`
* `strava.activities.listFriends(args,done)` -> deprecated at 2.2.0
* `strava.activities.listZones(args,done)`
* `strava.activities.listLaps(args,done)`
* `strava.activities.listComments(args,done)`
* `strava.activities.listKudos(args,done)`
* `strava.activities.listPhotos(args,done)` -> deprecated at 2.2.0

#### Clubs

* `strava.clubs.get(args,done)`
* `strava.clubs.listMembers(args,done)`
* `strava.clubs.listActivities(args,done)`
* `strava.clubs.listAnnouncements(args,done)`
* `strava.clubs.listEvents(args,done)`
* `strava.clubs.listAdmins(args,done)`
* `strava.clubs.joinClub(args,done)`
* `strava.clubs.leaveClub(args,done)`

#### Gear

* `strava.gear.get(args,done)`

#### Push Subscriptions

These methods Authenticate with a Client ID and Client Secret. Since they don't
use OAuth, they are not available on the `client` object.

 * `strava.pushSubscriptions.list({},done)`
 * `strava.pushSubscriptions.create({callback_url:...},done)`
 *  We set 'object\_type to "activity" and "aspect\_type" to "create" for you.
 * `strava.pushSubscriptions.delete({id:...},done)`

#### Running Races

 * `strava.runningRaces.get(args,done)`
 * `strava.runningRaces.listRaces(args,done)`

#### Routes

 * `strava.routes.getFile({ id: routeId, file_type: 'gpx' },done)` *file_type may also be 'tcx'*
 * `strava.routes.get(args,done)`

#### Segments

 * `strava.segments.get(args,done)`
 * `strava.segments.listStarred(args,done)`
 * `strava.segments.listEfforts(args,done)`
 * `strava.segments.listLeaderboard(args,done)`
 * `strava.segments.explore(args,done)` *Expects arg `bounds` as a comma separated string, for two points describing a rectangular boundary for the search: `"southwest corner latitutde, southwest corner longitude, northeast corner latitude, northeast corner longitude"`*.

#### Segment Efforts

 * `strava.segmentEfforts.get(args,done)`

#### Streams

 * `strava.streams.activity(args,done)`
 * `strava.streams.effort(args,done)`
 * `strava.streams.segment(args,done)`

#### Uploads

 * `strava.uploads.post(args,done)`

## Error Handling

Except for the OAuth calls, errors will returned that are
`instanceof` `StatusCodeError` when the HTTP status code is not 2xx. In the
Promise-based API, the promise will be rejected. An error of type
`RequestError` will be returned if the request fails for technical reasons.
Example error checking:

```javascript
     const errors = require('request-promise/errors')

    // Catch a non-2xx response with the Promise API
    badClient.athlete.get({})
        .catch(errors.StatusCodeError, function (e) {
        })

    badClient.athlete.get({},function(err,payload){
      // err will be instanceof errors.StatusCodeError
    }
```

The `StatusCodeError` object includes extra properties to help with debugging:

 - `name` is always `StatusCodeError`
 - `statusCode` contains the HTTP status code
 - `message` Contains the body of the response.
 - `options` Contains the `option` used in the request
-  `response` Contains the response object

## Development

This package includes a full test suite runnable via `yarn test`.
It will both lint and run shallow tests on API endpoints.

### Running the tests

You'll first need to supply `data/strava_config` with an `access_token` that
has both private read and write permissions. Look in `./scripts` for a tool
to help generate this token. Going forward we plan to more testing with a mocked
version of the Strava API so testing with real account credentials are not required.

* Make sure you've filled out all the fields in `data/strava_config`.
* Use `strava.oauth.getRequestAccessURL({scope:"view_private,write"})` to generate the request url and query it via your browser.
* Strava will prompt you (the user) to allow access, say yes and you'll be sent to your Authorization Redirection URI - the parameter `code` will be included in the redirection url.
* Exchange the `code` for a new `access_token`:

```js
// access_token is at payload.access_token
const payload = await strava.oauth.getToken(authorizationCode)
```
Finally, the test suite has some expectations about the Strava account that it
connects for the tests to pass. The following should be true about the Strava
data in the account:

 * Must have at least one activity posted on Strava
 * Must have joined at least one club
 * Must have added at least one piece of gear (bike or shoes)
 * Must have created at least one route
 * Most recent activity with an achievement should also contain a segment

(Contributions to make the test suite more self-contained and robust by converting more tests
to use `nock` are welcome!)

* You're done! Paste the new `access_token` to `data/strava_config` and go run some tests:

`yarn test`.

### How the tests work

Using the provided `access_token` tests will access each endpoint individually:

* (For all `GET` endpoints) checks to ensure the correct type has been returned from the Strava.
* (For `PUT` in `athlete.update`) changes some athlete properties, then changes them back.
* (For `POST/PUT/DELETE` in `activities.create/update/delete`) first creates an activity, runs some operations on it, then deletes it.

## Debugging

You can enable a debug mode for the underlying `request` module to see details
about the raw HTTP requests and responses being sent back and forth from the
Strava API.

To enable this, set this in the environment before this module is loaded:

  NODE\_DEBUG=request

You can also set `process.env.NODE_DEBUG='request' in your script before this module is loaded.

## Resources

* [Strava Developers Center](http://www.strava.com/developers)
* [Strava API Reference](https://developers.strava.com/docs/reference/)

## Author and Maintainer

Authored by Austin Brown <austin@unboundev.com> (http://austinjamesbrown.com/).

Currently Maintained by Mark Stosberg <mark@rideamigos.com>  

