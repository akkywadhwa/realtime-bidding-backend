const TransporterSchema = require("../model/TransporterSchema");

const contractors = [
    { id: 1, name: 'Head Contractor', username: 'contractor1', password: 'password' }
]

async function authenticate(userType, username, password, callback) {
    let user = null;
    if (userType === 'transporter') {
        TransporterSchema.findOne({ username: username, password: password }).then(transporter => {
            if (transporter) callback(true, transporter._id);
            else callback(false, null);
        }).catch(error => {
            callback(false, null);
        })
    }
    else if (userType === 'contractor') {
        user = contractors.find(contractor => (contractor.username === username && contractor.password === password));
        if (user) callback(true, user.id);
        else callback(false, null);
    }
}

module.exports = { authenticate }