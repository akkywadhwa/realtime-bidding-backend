const express = require('express');
const router = express.Router();
const notificationService = require('../services/NotificationService');
const roles = require('../utils/api-role');
const authorize = require('../middlewares/authorize');
const { decodeToken } = require('../utils/jwt');

router.get('/', authorize(roles.transporter), (request, response) => {
    const authorizationHeaders = request.headers['authorization'];
    const token = authorizationHeaders && authorizationHeaders.split(' ')[1];
    const decodedToken = decodeToken(token);

    notificationService.getNotifications(decodedToken.id, result => {
        response.status(200).json(result);
    }).catch(error => {
        response.status(500).json({ message: "Internal Server Error" });
    });
});

router.put('/', authorize(roles.transporter), (request, response) => {
    notificationService.readNotification(request.body.notificationID, read => {
        response.status(200).json({ read: read });
    }).catch(error => {
        response.status(500).json({ message: "Internal Server Error" });
    });
});

module.exports = router;