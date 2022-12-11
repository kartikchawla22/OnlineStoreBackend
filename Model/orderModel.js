const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');
require("dotenv").config();
const Schema = mongoose.Schema;
const { MONGO_USER, MONGO_PASSOWRD, MONGO_DB } = process.env;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSOWRD}@cluster0.pgtzola.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;
const connection = mongoose.createConnection(uri);

autoIncrement.initialize(connection);

const Order = new Schema({
    orderID: {
        type: Number,
        required: true,
        unique: true
    },
    items: {
        type: Array,
        required: true
    },
    token: {
        type: String,
        default: ""
    },
    total: {
        type: Number,
        default: 0
    },
    paymentId: {
        type: String,
        default: ""
    },
    intent: {
        type: String
    },
    status: {
        type: String
    },
    payer: {
        type: {},
        default: ""
    },
    orderDateTime: {
        type: Date,
        default: ""
    },
    success: {
        type: Boolean,
        default: false
    },
    captureOrderId: {
        type: String,
        default: ""
    },
    access_token: {
        type: String,
        default: ""
    }
});


Order.plugin(autoIncrement.plugin, { model: 'Orders', field: 'orderID' });
module.exports = mongoose.model("Orders", Order);

