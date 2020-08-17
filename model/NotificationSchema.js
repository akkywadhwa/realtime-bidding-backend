const mongoose = require('mongoose')

const NotificationSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    contractID: { type: mongoose.Schema.Types.ObjectId, ref: 'contracts' },
    transporterID: { type: mongoose.Schema.Types.ObjectId, ref: 'transporter' },
    seen: Boolean,
})

module.exports = mongoose.model('notifications', NotificationSchema)