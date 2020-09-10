require('dotenv').config();
var express = require("express");
var router = express.Router();
const jwt = require('jsonwebtoken');
var models = require('../models'); 
var Users = models.Users; 

const ACCESS_TOKEN_SECRET = 'dbnHKWfkhgFXAshcCs5AZ7HUe0dAzDg5DtZZIgn0ZzIUP8CL4h';

const REFRESH_TOKEN_SECRET = 'z01XOWoyEuASSYH9vexE2BzYKvTko1x23tBeeEPMjyMWcAVzlk';

/* GET JWT for authorized user. */
router.post("/", async function(req, res, next) {
  console.log('================',req.body)
  let users = await Users.findAll({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  });
  let user = users[0];
  if(user && user.id) {
    console.log(user.name, user.id);
    const accessToken = jwt.sign({name: user.name, id:user.id}, process.env.ACCESS_TOKEN_SECRET);
    console.log('accessToken-->',accessToken);
    res.json({accessToken: accessToken});
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
