const countryCode = require("../models/ISDModel");

const addCountryCodes = async (req, res) => {
  try {
    const addCodes = await countryCode.insertMany(req.body.data);

    if (addCodes) {
      res.send({ status: true, message: "Country codes added to DB" });
    }
  } catch (error) {
    res.send({ status: false, message: error.message });
  }
};

const getCountryCodes = async (req, res) => {
  try {
    const getCodes = await countryCode.find({}, { _id: 0, country: 0 });

    res.send({ status: true, data: getCodes });
  } catch (error) {
    res.send({ status: false, message: error.message });
  }
};

const apiCall = async (code) => {
  const getCodesOneByOne = await countryCode.findOne(
    { code },
    { _id: 0, country: 0, code: 0 }
  );
  return getCodesOneByOne;
};

const fetchCountryOneByOne = async (req, res) => {
  const apidata = req.body.data;

  try {
    const getData = await Promise.all(
      apidata.map(async (i) => {
        // return await apiCall(i.code);
        const getCodesOneByOne = await countryCode.findOne(
          { code: i.code },
          { _id: 0, country: 0, code: 0 }
        );
        if (getCodesOneByOne) {
          return getCodesOneByOne;
        }
      })
    ).then((resp) => resp);

    res.send({ status: true, data: getData });
  } catch (error) {
    res.send({ status: false, message: error.message });
  }
};

module.exports = { addCountryCodes, getCountryCodes, fetchCountryOneByOne };
