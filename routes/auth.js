require('dotenv').config();
var express = require("express");
var router = express.Router();
const jwt = require('jsonwebtoken');
var models = require('../models'); 
var Users = models.Users; 

/* GET JWT for authorized user. */
router.post("/", async function(req, res, next) {
  console.log('================',req.body)
  let users = await Users.findAll({
    where: {
      email: req.body.email,
      password: Buffer.from(req.body.password).toString('base64')
    }
  });
  let user = users[0];
  if(user && user.id) {
    console.log(user.name, user.id);
    const accessToken = jwt.sign(
      {
        id:user.id,
        name: user.name
      }, 
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1d'
      }
    );
    console.log('accessToken-->',accessToken);
    res.json({accessToken: accessToken});
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
