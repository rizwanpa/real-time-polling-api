require('dotenv').config();
var express = require("express");
var router = express.Router();
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = 'dbnHKWfkhgFXAshcCs5AZ7HUe0dAzDg5DtZZIgn0ZzIUP8CL4h';

const REFRESH_TOKEN_SECRET = 'z01XOWoyEuASSYH9vexE2BzYKvTko1x23tBeeEPMjyMWcAVzlk';

/* GET JWT for authorized user. */
router.post("/login", function(req, res, next) {
    //console.log('process.env-->',process.env.ACCESS_TOKEN_SECRET);
    const user = {userNane : 'Rizwan Ansari', email : ''}
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    console.log('accessToken-->',accessToken);
  res.json({accessToken: accessToken});
});

module.exports = router;
