const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const constants = require('./constants');

const client = redis.createClient(constants.REDIS_CONNECTION_STRING);
client.set = util.promisify(client.set);

module.exports = client;