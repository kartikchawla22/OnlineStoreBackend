const mongoose = require("mongoose");
require("dotenv").config();
const { MONGO_USER, MONGO_PASSOWRD, MONGO_DB } = process.env;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASSOWRD}@cluster0.pgtzola.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;
let db;

const connectToServer = new Promise(async (resolve, reject) => {
  try {
    db = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    resolve(db);
  } catch (e) {
    reject(e);
  }
});

module.exports = connectToServer;
