const BidSchema = require("../model/BidSchema");
const ContractSchema = require("../model/ContractSchema");

async function createBid(contractID, transporterID, bidAmount, callback) {
    BidSchema.find({ contractID: contractID }).sort({ bidAmount: 1 }).limit(1).then(bids => {
        if (bids.length === 0) {
            ContractSchema.find({ _id: contractID }).limit(1).then(contracts => {
                if (contracts.length > 0) {
                    if (bidAmount < contracts[0].bidCap) {
                        const new_bid = new BidSchema({
                            contractID: contractID,
                            transporterID: transporterID,
                            bidAmount: bidAmount
                        });

                        new_bid.save((error, bid) => {
                            if (error) {
                                callback(null);
                            }
                            callback(bid);
                        });
                    } else {
                        callback("Bid amount more than bidcap");
                    }
                } else {
                    callback("Contract with this id does not exist");
                }
            })
        }
        else if (bids && bids[0].bidAmount > bidAmount) {
            const new_bid = new BidSchema({
                contractID: contractID,
                transporterID: transporterID,
                bidAmount: bidAmount
            });

            new_bid.save((error, bid) => {
                if (error) {
                    callback(null);
                }
                callback(bid);
            });
        }
        else {
            callback("Bid amount more than top bid");
        }
    }).catch(error => {
        console.log(error);
        callback(null);
    })
}

const getTopBid = async (contractID) => {
    return BidSchema.find({ contractID: contractID }).sort({ bidAmount: 1 }).limit(1);
}

const canBidNow = (contractID, transporterID, callback) => {
    let allChecks = false;
    BidSchema.find({ contractID: contractID, transporterID: transporterID }).then(bids => {
        ContractSchema.findOne({ _id: contractID }).then(result => {
            if (!result) {
                callback(true);
            } else {
                if (bids.length < result.allowedRevision + 1) allChecks = true;
                callback(allChecks);
            }
        }).catch(error => {
            callback(false);
        });
    }).catch(error => {
        callback(false);
    });
}

const getAllBids = (contractID, callback) => {
    BidSchema.find({ contractID: contractID }).populate('transporterID').then(bids => {
        if (bids) callback(bids);
        else callback([]);
    })
}

module.exports = { createBid, getTopBid, canBidNow, getAllBids }