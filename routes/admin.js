require('dotenv').config();
var express = require("express");
var router = express.Router();
const jwtmiddleware = require('../jwt/jwtmiddleware')

/* GET JWT for authorized user. */
router.post("/", jwtmiddleware, async function(req, res, next) {
  res.json({message:'hello admin'})
});

module.exports = router;
