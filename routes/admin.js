require('dotenv').config();
var express = require("express");
var router = express.Router();
const jwt = require('jsonwebtoken');
const jwtmiddleware = require('../jwt/jwtmiddleware')

/* GET JWT for authorized user. */
router.post("/", jwtmiddleware, async function(req, res, next) {
  let token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  let userId = decoded.id;
  console.log(userId);
  res.json({message:'hello admin'})
});

module.exports = router;