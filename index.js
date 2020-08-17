const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('./utils/redis');

const constants = require('./utils/constants');

const TransporterSchema = require('./model/TransporterSchema');
const { transporter } = require('./utils/api-role');

mongoose.connect(constants.DATABASE_CONNECTION_STRING, { useUnifiedTopology: true, useNewUrlParser: true });

const app = express();
const port = 9000;

// clearing previous cache
redis.del('contracts');

const expressServer = app.listen(port, () => {
    console.log('Listening on port:', port);
});

const io = require('socket.io').listen(expressServer);

io.sockets.on('connection', function (socket) {
    console.log('A socket client is connected');
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

// saving demo data
TransporterSchema.find({}).then(transporter => {
    if (transporter.length == 0) {
        TransporterSchema.create({ name: 'ABC Transporters', address: 'New Delhi', username: 'transporter1', password: 'password' });
        TransporterSchema.create({ name: 'XYZ Transporters', address: 'Haryana', username: 'transporter2', password: 'password' });
        TransporterSchema.create({ name: 'BLR Transporters', address: 'Karnataka', username: 'transporter3', password: 'password' });
    }
});

app.use(function (request, response, next) {
    request.io = io;
    next();
});

app.use('/api/bid', require('./controllers/BidController'));
app.use('/api/login', require('./controllers/UserController'));
app.use('/api/notifications', require('./controllers/NotificationController'));
app.use('/api/contracts', require('./controllers/ContractController'));

