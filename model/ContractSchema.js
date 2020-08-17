const mongoose = require('mongoose')

const ContractSchema = mongoose.Schema({
    description: String,
    destinationCity: String,
    startTimestamp: Date,
    endTimestamp: Date,
    bidCap: Number,
    allowedRevision: Number,
})

module.exports = mongoose.model('contracts', ContractSchema)