// constants for database
const DATABASE_CONNECTION_STRING = 'mongodb://localhost:27017/bidding'

// constants for redis server
const REDIS_CONNECTION_STRING = 'redis://127.0.0.1:6379';

// constants for realtime communication
const UPDATE_BID_HISTORY = 'UPDATE_BID_HISTORY';
const UPDATE_NOTIFICATIONS = 'UPDATE_NOTIFICATIONS';

// jwt authentication
const JWT_SECRET_KEY = 'my_secret_key';

module.exports = {
    DATABASE_CONNECTION_STRING,
    REDIS_CONNECTION_STRING,
    UPDATE_BID_HISTORY,
    UPDATE_NOTIFICATIONS,
    JWT_SECRET_KEY,
}