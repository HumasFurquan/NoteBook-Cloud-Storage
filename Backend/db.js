const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

module.exports = async function connectToMongo() {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};
