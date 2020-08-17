const mongoose = require('mongoose')

const TransporterSchema = mongoose.Schema({
    name: String,
    address: String,
    username: String,
    password: String,
})

module.exports = mongoose.model('transporter', TransporterSchema)