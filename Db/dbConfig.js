const mongoose = require("mongoose");
require("dotenv").config();
async function connectDB() {
  const url = process.env.MONGODB_URL;

  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database connected: ${url}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const dbConnection = mongoose.connection;

  dbConnection.on("error", (err) => {
    console.error(`Connection error: ${err}`);
  });
}

module.exports = connectDB;
