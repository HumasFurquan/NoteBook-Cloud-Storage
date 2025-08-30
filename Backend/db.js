const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/inotebook";

module.exports = async function connectToMongo() {
  await mongoose.connect(mongoURI);
  console.log("Connected to Mongo");
};
