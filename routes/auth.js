require('dotenv').config();
var express = require("express");
var router = express.Router();
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = 'dbnHKWfkhgFXAshcCs5AZ7HUe0dAzDg5DtZZIgn0ZzIUP8CL4h';

const REFRESH_TOKEN_SECRET = 'z01XOWoyEuASSYH9vexE2BzYKvTko1x23tBeeEPMjyMWcAVzlk';

/* GET JWT for authorized user. */
router.post("/login", function(request, response, next) {
  // console.log('process.env-->', request);
  let user = {}
  for(let prop in request.body) {
    user[prop] = request.body[prop];
  }
  console.log(user);
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  console.log('accessToken-->',accessToken);
  response.json({accessToken: accessToken});
});

module.exports = router;
