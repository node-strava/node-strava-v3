
var RateLimit = {
  requestTime: new Date(), // Date
  shortTermLimit: 0, // Int
  longTermLimit: 0, // Int
  shortTermUsage: 0, // Int
  longTermUsage: 0, // Int
  readShortTermLimit: 0, // Int
  readLongTermLimit: 0, // Int
  readShortTermUsage: 0, // Int
  readLongTermUsage: 0 // Int
}

var rl = RateLimit

// should be called as `strava.rateLimiting.exceeded()
// to determine if the most recent request exceeded the rate limit
RateLimit.exceeded = function () {
  if (rl.shortTermLimit > 0 && rl.shortTermUsage >= rl.shortTermLimit) {
    return true
  }

  if (rl.longTermLimit > 0 && rl.longTermUsage >= rl.longTermLimit) {
    return true
  }

  return false
}

// fractionReached returns the current fraction of rate used.
// The greater of the short and long term limits.
// Should be called as `strava.rateLimiting.fractionReached()`
RateLimit.fractionReached = function () {
  var shortLimitFraction = rl.shortTermLimit > 0
    ? rl.shortTermUsage / rl.shortTermLimit
    : 0
  var longLimitFraction = rl.longTermLimit > 0
    ? rl.longTermUsage / rl.longTermLimit
    : 0

  if (shortLimitFraction > longLimitFraction) {
    return shortLimitFraction
  } else {
    return longLimitFraction
  }
}

// should be called as `strava.rateLimiting.readExceeded()
// to determine if the most recent request exceeded the rate limit
RateLimit.readExceeded = function () {
  if (rl.readShortTermLimit > 0 && rl.readShortTermUsage >= rl.readShortTermLimit) {
    return true
  }

  if (rl.readLongTermLimit > 0 && rl.readLongTermUsage >= rl.readLongTermLimit) {
    return true
  }

  return false
}

// readFractionReached returns the current fraction of rate used.
// The greater of the short and long term limits.
// Should be called as `strava.rateLimiting.readFractionReached()`
RateLimit.readFractionReached = function () {
  var shortLimitFraction = rl.readShortTermLimit > 0
    ? rl.readShortTermUsage / rl.readShortTermLimit
    : 0
  var longLimitFraction = rl.readLongTermLimit > 0
    ? rl.readLongTermUsage / rl.readLongTermLimit
    : 0

  if (shortLimitFraction > longLimitFraction) {
    return shortLimitFraction
  } else {
    return longLimitFraction
  }
}

RateLimit.parseRateLimits = function (headers) {
  if (!headers || !headers['x-ratelimit-limit'] || !headers['x-ratelimit-usage'] ||
      !headers['x-readratelimit-limit'] || !headers['x-readratelimit-usage']) {
    return null
  }

  var limit = headers['x-ratelimit-limit'].split(',')
  var usage = headers['x-ratelimit-usage'].split(',')
  var readLimit = headers['x-readratelimit-limit'].split(',')
  var readUsage = headers['x-readratelimit-usage'].split(',')
  var radix = 10

  return {
    shortTermUsage: parseInt(usage[0], radix),
    shortTermLimit: parseInt(limit[0], radix),
    longTermUsage: parseInt(usage[1], radix),
    longTermLimit: parseInt(limit[1], radix),
    readShortTermUsage: parseInt(readUsage[0], radix),
    readShortTermLimit: parseInt(readLimit[0], radix),
    readLongTermUsage: parseInt(readUsage[1], radix),
    readLongTermLimit: parseInt(readLimit[1], radix)
  }
}

RateLimit.updateRateLimits = function (headers) {
  var newLimits = this.parseRateLimits(headers)
  if (newLimits) {
    this.requestDate = new Date()
    this.shortTermLimit =
      !isNaN(newLimits.shortTermLimit) ? newLimits.shortTermLimit : 0
    this.shortTermUsage =
      !isNaN(newLimits.shortTermUsage) ? newLimits.shortTermUsage : 0
    this.longTermLimit =
      !isNaN(newLimits.longTermLimit) ? newLimits.longTermLimit : 0
    this.longTermUsage =
      !isNaN(newLimits.longTermUsage) ? newLimits.longTermUsage : 0
    this.readShortTermLimit =
      !isNaN(newLimits.readShortTermLimit) ? newLimits.readShortTermLimit : 0
    this.readShortTermUsage =
      !isNaN(newLimits.readShortTermUsage) ? newLimits.readShortTermUsage : 0
    this.readLongTermLimit =
      !isNaN(newLimits.readLongTermLimit) ? newLimits.readLongTermLimit : 0
    this.readLongTermUsage =
      !isNaN(newLimits.readLongTermUsage) ? newLimits.readLongTermUsage : 0
  } else {
    this.clear()
  }
  return newLimits
}

RateLimit.clear = function () {
  this.requestTime = new Date()
  this.shortTermLimit = 0
  this.longTermLimit = 0
  this.shortTermUsage = 0
  this.longTermUsage = 0
  this.readShortTermLimit = 0
  this.readLongTermLimit = 0
  this.readShortTermUsage = 0
  this.readLongTermUsage = 0
}

module.exports = RateLimit
