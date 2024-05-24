const mongoose = require("mongoose");

const connectDB = () => {
  const uri = process.env.MONGO_URI;
  mongoose.connect(uri).then(() => console.log("Database connected!"));
};

module.exports = connectDB;
