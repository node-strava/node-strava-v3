
# strava-v3

A simple Node.js wrapper for Strava's v3 API

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Test Suite][github-actions-image]][github-actions-url]

[npm-image]: https://img.shields.io/npm/v/strava-v3.svg?style=flat
[npm-url]: https://npmjs.org/package/strava-v3
[downloads-image]: https://img.shields.io/npm/dm/strava-v3.svg?style=flat
[downloads-url]: https://npmjs.org/package/strava-v3
[github-actions-image]: https://github.com/node-strava/node-strava-v3/actions/workflows/on-pull-request.yml/badge.svg
[github-actions-url]: https://github.com/node-strava/node-strava-v3/actions/workflows/on-pull-request.yml

Supports many but not all Strava API endpoints:

* `oauth`
* `athlete`
* `athletes`
* `activities`
* `clubs`
* `gear`
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

```js
import strava from 'strava-v3';
```

Importing both the library as well as interfaces:

```js
import { default as strava, Strava } from 'strava-v3';
```

## Quick start

* Create an application at [strava.com/settings/api](https://www.strava.com/settings/api) and make note of your `access_token`

### API

The library supports only Promises; callback-style usage is not supported for API endpoints.

```js
const strava = require('strava-v3')
strava.config({...})
const payload = await strava.athlete.get({})
console.log(payload)
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

* `STRAVA_ACCESS_TOKEN` = `access_token`
* `STRAVA_CLIENT_ID` = `client_id`
* `STRAVA_CLIENT_SECRET` = `client_secret`
* `STRAVA_REDIRECT_URI` = `redirect_uri`

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

API access is designed to be as closely similar in layout as possible to Strava's own architecture. All API methods return Promises:

```js
var strava = require('strava-v3')

strava.<api endpoint>.<api endpoint option>(args)
```

Example usage:

```js
var strava = require('strava-v3');
const payload = await strava.athlete.get({id:12345});
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

For those API calls that support pagination, you can control both the `page` being retrieved and the
number of responses to return `per_page` by adding the corresponding properties to `args`.

`page` and `per_page` are deprecated in favor of `page_size` and `after_cursor` for most endpoints
now, however some still require the old arguments, according to the API documentation.

Example usage:

```js
const strava = require('strava-v3');
const payload = await strava.athlete.listActivities({
    page: 1,
    per_page: 2
});
```

or using cursor-based pagination:

```js
const strava = require('strava-v3');
const comments = await strava.activities.listComments({
  id: activityId,
  page_size: 20,
  after_cursor: "abc123%20"
});
```

### Uploading files

To upload a file you'll have to pass in the `data_type` as specified in Strava's API reference as well as a string `file` designating the `<filepath>/<filename>`. By default no status polling is performed—the promise resolves immediately with the initial upload response. To wait until processing is complete, set `maxStatusChecks` (e.g. `300` for ~5 minutes at 1s intervals); the promise will then resolve with the final upload result.

Example usage:

```js
const strava = require('strava-v3');
// Resolve immediately after posting
const payload = await strava.uploads.post({
    data_type: 'gpx',
    file: 'data/your_file.gpx',
    name: 'Epic times'
});

// Or wait until processing is complete (polls once per second, up to maxStatusChecks times)
const result = await strava.uploads.post({
    data_type: 'gpx',
    file: 'data/your_file.gpx',
    name: 'Epic times',
    maxStatusChecks: 300
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

### Supported API Endpoints

All API methods return Promises.

See Strava API docs for returned data structures.

#### OAuth

* `strava.oauth.getRequestAccessURL(args)`
* `strava.oauth.getToken(code)` (Used for token exchange)
* `strava.oauth.refreshToken(refreshToken)`
* `strava.oauth.deauthorize(args)`

#### Athlete

* `strava.athlete.get(args)`
* `strava.athlete.update(args)` // only 'weight' can be updated.
* `strava.athlete.listActivities(args)` *Get list of activity summaries*
* `strava.athlete.listClubs(args)`
* `strava.athlete.listZones(args)`

#### Athletes

* `strava.athletes.stats(args)`

#### Activities

* `strava.activities.get(args)`
* `strava.activities.create(args)`
* `strava.activities.update(args)`
* `strava.activities.listZones(args)`
* `strava.activities.listLaps(args)`
* `strava.activities.listComments(args)`
* `strava.activities.listKudoers(args)`

#### Clubs

* `strava.clubs.get(args)`
* `strava.clubs.listMembers(args)`
* `strava.clubs.listActivities(args)`
* `strava.clubs.listAdmins(args)`

#### Gear

* `strava.gear.get(args)`

#### Push Subscriptions

These methods Authenticate with a Client ID and Client Secret. Since they don't
use OAuth, they are not available on the `client` object.

* `strava.pushSubscriptions.list()`
* `strava.pushSubscriptions.create({callback_url:...})`
* We set 'object\_type to "activity" and "aspect\_type" to "create" for you.
* `strava.pushSubscriptions.delete({id:...})`

#### Routes

* `strava.routes.getFile({ id: routeId, file_type: 'gpx' })` *file_type may also be 'tcx'*
* `strava.routes.get(args)`

#### Segments

* `strava.segments.get(args)`
* `strava.segments.listStarred(args)`
* `strava.segments.listEfforts(args)`
* `strava.segments.explore(args)` *Expects arg `bounds` as a comma-separated string, for two points describing a rectangular boundary for the search: `"southwest corner latitude, southwest corner longitude, northeast corner latitude, northeast corner longitude"`*.
* `strava.segments.starSegment(args)`

#### Segment Efforts

* `strava.segmentEfforts.get(args)`

#### Streams

* `strava.streams.activity(args)`
* `strava.streams.effort(args)`
* `strava.streams.segment(args)`
* `strava.streams.route(args)`

#### Uploads

* `strava.uploads.post(args)`

## Error Handling

Except for the OAuth calls, errors returned will be instances of `StatusCodeError` when the HTTP status code is not 2xx. In the Promise-based API, the promise will be rejected. An error of type `RequestError` will be returned if the request fails for technical reasons.

The updated version now uses Axios for HTTP requests and custom error classes for compatibility with the previous implementation.

Errors reject the Promise. The project no longer relies on Bluebird, and callback-style usage is not supported.

Example error checking:

```javascript
    const strava = require('strava-v3');
    const { StatusCodeError, RequestError } = strava.axiosUtility;

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

* `name` is always `StatusCodeError`
* `statusCode` contains the HTTP status code
* `message` contains the response's status message and additional error details
* `data` contains the body of the response, which can be useful for debugging
* `options` contains the options used in the request
* `response` contains the response object

The `RequestError` object is used for errors that occur due to technical issues, such as no response being received or request setup issues, and includes the following properties:

* `name` is always `RequestError`
* `message` contains the error message
* `options` contains the options used in the request

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

* Run ESLint on all JavaScript files
* Execute all unit tests using mocked API responses

### How the tests work

* Tests use Mocha and Node.js's built-in `assert` module
* HTTP interaction is performed with Axios; all tests mock HTTP requests using `nock`

The test suite validates:

* All `GET` endpoints return the correct data structure
* All `POST`/`PUT`/`DELETE` endpoints handle requests and responses correctly
* Error handling works as expected
* Rate limiting functionality is properly tested

## Resources

* [Strava Developers Center](http://www.strava.com/developers)
* [Strava API Reference](https://developers.strava.com/docs/reference/)

## Author and Maintainer

Authored by Austin Brown <austin@unboundev.com> (<http://austinjamesbrown.com/>).

Currently Maintained by Mark Stosberg <mark@rideamigos.com> and Wesley Schlenker <wesley@rideamigos.com>
