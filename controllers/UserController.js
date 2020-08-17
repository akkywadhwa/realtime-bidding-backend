const express = require('express');
const router = express.Router();
const userService = require('../services/UserService');
const { encodeToken } = require('../utils/jwt');

router.get('/', (request, response) => {
    try {
        if (!request.headers.authorization || request.headers.authorization.indexOf('Basic ') === -1) {
            return response.status(401).json({ message: 'Missing Authorization Header' });
        }
        if (!request.query.userType) {
            return response.status(400).json({ message: 'Bad Request' });
        }

        const base64Credentials = request.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        userService.authenticate(request.query.userType, username, password, (authenticated, userID) => {
            if (authenticated) {
                const token = encodeToken(userID, request.query.userType);
                response.status(200).json({ token: token });
            }
            else {
                return response.status(401).json({ message: 'Unauthorized Request' });
            }
        });
    }
    catch (ex) {
        response.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;