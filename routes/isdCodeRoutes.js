const express = require("express");
const {
  addCountryCodes,
  getCountryCodes,
  fetchCountryOneByOne,
} = require("../services/countryCode");
const router = express.Router();

router.post("/addCountryCodes", addCountryCodes);
router.get("/get-country-codes", getCountryCodes);
// router.post("/get-country-codes", fetchCountryOneByOne);

module.exports = router;
