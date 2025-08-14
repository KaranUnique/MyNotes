const mongoose = require("mongoose");

require("dotenv").config();

const connectdb = () => {
  console.log("Connecting to:", process.env.MONGODB_URI);
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Database created");
    })
    .catch((err) => {
      console.log("error occur", err);
    });
};

module.exports = connectdb;
