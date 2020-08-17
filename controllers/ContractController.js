const express = require('express');
const router = express.Router();
const roles = require('../utils/api-role');
const authorize = require('../middlewares/authorize');
const contractService = require('../services/ContractService');
const notificationService = require('../services/NotificationService');
const bidService = require('../services/BidService');
const { decodeToken } = require('../utils/jwt');

router.get('/', authorize(), (request, response) => {
    contractService.getContracts(result => {
        response.status(200).json(result);
    });
});

router.post('/', authorize(roles.contractor), (request, response) => {
    contractService.createContract(request.body).then(contract => {
        if (contract) {
            notificationService.notify(contract._id).then(result => {
                request.io.emit('UPDATE_NOTIFICATIONS', { id: contract._id, contractID: { description: contract.description } });
                request.io.emit('UPDATE_CONTRACTS', contract);
                response.status(200).json(contract);
            }).catch(error => {
                response.status(500).json({ message: "Internal Server Error" });
            })
        }
        else {
            response.status(500).json({ message: "Internal Server Error" });
        }
    }).catch(error => {
        response.status(500).json({ message: "Internal Server Error" });
    });
});

router.get('/:contractID', authorize(), (request, response) => {
    const authorizationHeaders = request.headers['authorization'];
    const token = authorizationHeaders && authorizationHeaders.split(' ')[1];
    const decodedToken = decodeToken(token);
    if (decodedToken.role === roles.transporter) {
        contractService.getContractDetail(request.params.contractID).then(contract => {
            if (contract) {
                bidService.canBidNow(request.params.contractID, decodedToken.id, permitted => {
                    bidService.getTopBid(request.params.contractID).then(topBid => {
                        const result = {
                            "_id": contract._id,
                            "description": contract.description,
                            "destinationCity": contract.destinationCity,
                            "startTimestamp": contract.startTimestamp,
                            "endTimestamp": contract.endTimestamp,
                            "bidCap": contract.bidCap,
                            "allowedRevision": contract.allowedRevision,
                            "canBidNow": permitted,
                            "topBidAmount": topBid.length > 0 ? topBid[0].bidAmount : null
                        }
                        response.status(200).json(result);
                    }).catch(error => {
                        response.status(500).json({ message: 'Internal Server Error' });
                    })
                });
            } else {
                response.status(400).json({ message: "Contract with given id not found" });
            }
        }).catch(error => {
            response.status(500).json({ message: "Internal Server Error" });
        });
    }
    else {
        contractService.getContractDetail(request.params.contractID).then(contract => {
            if (contract) {
                bidService.getAllBids(request.params.contractID, bids => {
                    const result = {
                        "_id": contract._id,
                        "description": contract.description,
                        "destinationCity": contract.destinationCity,
                        "startTimestamp": contract.startTimestamp,
                        "endTimestamp": contract.endTimestamp,
                        "bidCap": contract.bidCap,
                        "allowedRevision": contract.allowedRevision,
                        "bids": bids,
                    }
                    response.status(200).json(result);
                })
            }
            else {
                response.status(400).json({ message: "Contract with given id not found" });
            }
        }).catch(error => {
            response.status(500).json({ message: "Internal Server Error" });
        });
    }
});


module.exports = router;
