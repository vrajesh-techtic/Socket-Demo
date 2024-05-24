const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ status: true, message: "Chat API is working fine!" });
});

module.exports = router;
