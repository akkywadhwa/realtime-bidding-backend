const jwt = require('express-jwt');
const constants = require('../utils/constants');
const { decodeToken } = require('../utils/jwt');


const authorize = (roles = []) => {
    if (typeof roles === 'string') roles = [roles]
    return [
        (request, response, next) => {
            const authorizationHeaders = request.headers['authorization'];
            const token = authorizationHeaders && authorizationHeaders.split(' ')[1];
            if (!token) {
                response.status(401).json({ message: 'Missing authentication token' });
            }
            else {
                const decodedToken = decodeToken(token);
                if (roles.length && !roles.includes(decodedToken.role)) {
                    return response.status(401).json({ message: 'Unauthorized Access' });
                }
                next();
            }
        }
    ]
}

module.exports = authorize;