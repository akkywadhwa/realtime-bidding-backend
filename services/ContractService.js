const ContractSchema = require("../model/ContractSchema");

const redis = require("../utils/redis");

const createContract = async ({ description, destinationCity, startTimestamp, endTimestamp, bidCap, allowedRevision }) => {
    const new_contract = new ContractSchema({
        description: description,
        destinationCity: destinationCity,
        startTimestamp: startTimestamp,
        endTimestamp: endTimestamp,
        bidCap: bidCap,
        allowedRevision: allowedRevision
    });
    redis.del('contracts');
    return new_contract.save();
}

const getContracts = callback => {
    redis.get('contracts', (error, data) => {
        if (data) {
            callback(JSON.parse(data));
        }
        else {
            ContractSchema.find({}, (error, contracts) => {
                if (error) {
                    callback(null);
                } else {
                    redis.set('contracts', JSON.stringify(contracts));
                    callback(contracts);
                }
            });
        }
    });
}

const getContractDetail = (contractID) => {
    return ContractSchema.findOne({ _id: contractID }, (error, contract) => {
        if (error) return error;
    });
}

module.exports = { createContract, getContracts, getContractDetail };