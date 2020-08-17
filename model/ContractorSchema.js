const mongoose = require('mongoose');

const ContractorSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    name: String,
    originCity: String,
});

module.exports = mongoose.model('Contractor', ContractorSchema);