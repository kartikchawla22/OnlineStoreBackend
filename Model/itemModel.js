const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');
require("dotenv").config();
const Schema = mongoose.Schema;
const { MONGO_USER, MONGO_PASSOWRD, MONGO_DB } = process.env;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSOWRD}@cluster0.pgtzola.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;
const connection = mongoose.createConnection(uri);

autoIncrement.initialize(connection);

const Item = new Schema({
  itemId: {
    type: Number,
    required: true,
    unique: true
  },
  imageUrl: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  maxQuantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});


Item.plugin(autoIncrement.plugin, { model: 'Items', field: 'itemId' });
module.exports = mongoose.model("Items", Item);

