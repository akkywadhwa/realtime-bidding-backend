const mongoose = require('mongoose')

const BidSchema = mongoose.Schema({
    //_id: String,
    contractID: { type: mongoose.Schema.Types.ObjectId, ref: 'contracts' },
    transporterID: { type: mongoose.Schema.Types.ObjectId, ref: 'transporter' },
    bidAmount: Number
})

module.exports = mongoose.model('bids', BidSchema)