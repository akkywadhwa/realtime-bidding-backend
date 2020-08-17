const jwt = require('jsonwebtoken');
const constants = require('./constants');

const encodeToken = (id, role) => {
    return jwt.sign({ id: id, role: role }, constants.JWT_SECRET_KEY);
}

const decodeToken = (token) => {
    return jwt.decode(token, constants.JWT_SECRET_KEY);
}

module.exports = { encodeToken, decodeToken }