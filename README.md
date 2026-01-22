
# strava-v3: Simple Node wrapper for Strava's v3 API

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Test Suite][github-actions-image]][github-actions-url]

[npm-image]: https://img.shields.io/npm/v/strava-v3.svg?style=flat
[npm-url]: https://npmjs.org/package/strava-v3
[downloads-image]: https://img.shields.io/npm/dm/strava-v3.svg?style=flat
[downloads-url]: https://npmjs.org/package/strava-v3
[github-actions-image]: https://github.com/node-strava/node-strava-v3/actions/workflows/on-pull-request.yml/badge.svg
[github-actions-url]: https://github.com/node-strava/node-strava-v3/actions/workflows/on-pull-request.yml

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
strava.athlete.get({id:12345},function(err,payload,limits) {
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

Less conveniently, you can also explicitly pass an `access_token` to API calls:

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
For more details see: [Rate Limits](https://developers.strava.com/docs/rate-limits/)

Returns `null` if `X-Ratelimit-Limit`, `X-RateLimit-Usage`, `X-ReadRateLimit-Limit`, or
`X-ReadRateLimit-Usage` headers are not provided

#### Global status

In our promise API, only the response body "payload" value is returned as a Promise. To track
rate limiting we use a global counter accessible through `strava.rateLimiting`.
 The rate limiting status is updated with each request.

```js
    // returns true if the most recent request exceeded the overall rate limit
    strava.rateLimiting.exceeded()

    // returns the current decimal fraction (from 0 to 1) of overall rate used. The greater of the short and long term limits.
    strava.rateLimiting.fractionReached()

    // returns true if the most recent request exceeded the read rate limit
    strava.rateLimiting.readExceeded()

    // returns the current decimal fraction (from 0 to 1) of read rate used. The greater of the short and long term limits.
    strava.rateLimiting.readFractionReached()
```

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
       shortTermLimit: 200,
       longTermUsage: 12,
       longTermLimit: 2000,
       readShortTermUsage: 2,
       readShortTermLimit: 100,
       readLongTermUsage: 5,
       readLongTermLimit: 1000
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
* `strava.athlete.listClubs(args,done)`
* `strava.athlete.listZones(args,done)`

#### Athletes

* `strava.athletes.stats(args,done)`

#### Activities

* `strava.activities.get(args,done)`
* `strava.activities.create(args,done)`
* `strava.activities.update(args,done)`
* `strava.activities.listZones(args,done)`
* `strava.activities.listLaps(args,done)`
* `strava.activities.listComments(args,done)`
* `strava.activities.listKudos(args,done)`

#### Clubs

* `strava.clubs.get(args,done)`
* `strava.clubs.listMembers(args,done)`
* `strava.clubs.listActivities(args,done)`
* `strava.clubs.listAdmins(args,done)`

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

Except for the OAuth calls, errors returned will be instances of `StatusCodeError` when the HTTP status code is not 2xx. In the Promise-based API, the promise will be rejected. An error of type `RequestError` will be returned if the request fails for technical reasons.

The updated version now uses Axios for HTTP requests and custom error classes for compatibility with the previous implementation.

In the Promise-based API, errors will reject the Promise. In the callback-based API (where supported), errors will pass to the `err` argument in the callback.

The project no longer relies on Bluebird. Where applicable, callback handling has been removed.

Example error checking:

```javascript
    const { StatusCodeError, RequestError } = require('./axiosUtility');

    // Catch a non-2xx response with the Promise API
    badClient.athlete.get({})
        .catch((e) => {
            if (e.name === 'StatusCodeError') {
                // handle StatusCodeError
            }
        });

    // Or handle all errors
    badClient.athlete.get({})
        .catch((err) => {
            console.error(err);
        });
```

The `StatusCodeError` object includes extra properties to help with debugging:

 - `name` is always `StatusCodeError`
 - `statusCode` contains the HTTP status code
 - `message` contains the response's status message and additional error details
 - `data` contains the body of the response, which can be useful for debugging
 - `options` contains the options used in the request
 - `response` contains the response object

The `RequestError` object is used for errors that occur due to technical issues, such as no response being received or request setup issues, and includes the following properties:

- `name` is always `RequestError`
- `message` contains the error message
- `options` contains the options used in the request

This update maintains feature parity with the previous implementation of `request-promise` while using the Axios HTTP client under the hood.


## Development

This package includes a full test suite runnable via `yarn test`.
It will both lint and run tests on API endpoints.

### Running the tests

All tests use `nock` to mock the Strava API and can run without any real credentials or network access.

Simply run:

```bash
yarn test
```

The test suite will:

- Run ESLint on all JavaScript files
- Execute all unit tests using mocked API responses

### How the tests work

- Tests use Mocha and Node.js's built-in `assert` module
- HTTP interaction is performed with Axios; all tests mock HTTP requests using `nock`

The test suite validates:
* All `GET` endpoints return the correct data structure
* All `POST`/`PUT`/`DELETE` endpoints handle requests and responses correctly
* Error handling works as expected
* Rate limiting functionality is properly tested

## Resources

* [Strava Developers Center](http://www.strava.com/developers)
* [Strava API Reference](https://developers.strava.com/docs/reference/)

## Author and Maintainer

Authored by Austin Brown <austin@unboundev.com> (http://austinjamesbrown.com/).

Currently Maintained by Mark Stosberg <mark@rideamigos.com> and Wesley Schlenker <wesley@rideamigos.com>
