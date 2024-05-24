const mongoose = require("mongoose");

const { Schema } = mongoose;

const countryCodeSchema = new Schema(
  {
    country: {
      type: String,
    },
    code: {
      type: String,
    },
    iso: {
      type: String,
    },
  },
  { versionKey: false }
);

const countryCode = mongoose.model("countryCode", countryCodeSchema);

module.exports = countryCode;
