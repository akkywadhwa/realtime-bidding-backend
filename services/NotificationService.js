const NotificationSchema = require("../model/NotificationSchema");
const TransporterSchema = require("../model/TransporterSchema");
const ContractSchema = require("../model/ContractSchema");
const e = require("express");

async function getNotifications(transporterID, callback) {
    NotificationSchema.find({ transporterID: transporterID, seen: false }).populate('contractID').then(notifications => {
        if (!notifications) callback([]);
        else callback(notifications);
    })
}

async function readNotification(notificationID, callback) {
    NotificationSchema.updateOne({ _id: notificationID }, { seen: true }, (error, notification) => {
        if (notification.nModified > 0) {
            callback(true);
        } else {
            callback(false);
        }
    })
}

const notify = (contractID) => {
    return TransporterSchema.find({}, (error, transporters) => {
        transporters.forEach(transporter => {
            const new_notification = new NotificationSchema({
                contractID: contractID,
                transporterID: transporter._id,
                seen: false
            });
            return new_notification.save();
        })
    })
}

module.exports = { getNotifications, readNotification, notify }