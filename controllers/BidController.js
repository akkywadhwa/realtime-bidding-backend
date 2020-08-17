const express = require('express');
const router = express.Router();
const bidService = require('../services/BidService');
const contractService = require('../services/ContractService');
const { decodeToken } = require('../utils/jwt');
const roles = require('../utils/api-role');
const authorize = require('../middlewares/authorize');

router.post('/', authorize(roles.transporter), (request, response) => {
    const authorizationHeaders = request.headers['authorization'];
    const token = authorizationHeaders && authorizationHeaders.split(' ')[1];
    const decodedToken = decodeToken(token);
    contractService.getContractDetail(request.body.contractID).then(contract => {
        const endTimestamp = new Date(contract.endTimestamp);
        const startTimestamp = new Date(contract.startTimestamp);
        if (endTimestamp > new Date() < startTimestamp) {
            bidService.canBidNow(request.body.contractID, decodedToken.id, permitted => {
                if (permitted) {
                    bidService.createBid(request.body.contractID, decodedToken.id, request.body.bidAmount, result => {
                        if (result != null && typeof result !== "string") {
                            response.status(200).json(result);
                        } else if (result != null) {
                            response.status(400).json({ message: result });
                        } else {
                            response.status(500).json({ message: 'Internal Server Error' });
                        }
                    });
                }
                else {
                    response.status(400).json({ message: "You cannot make another bid." });
                }
            });
        } else {
            response.status(400).json({ message: "Bidding on this contract is closed." });
        }
    })

});

module.exports = router;