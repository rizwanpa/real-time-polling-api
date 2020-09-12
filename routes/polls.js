require('dotenv').config();
var express = require("express");
var router = express.Router();
const jwtmiddleware = require('../jwt/jwtmiddleware');
const Polls  = require('../controllers/Polls');

const Sequelize = require('sequelize');
const bodyParser = require('body-parser');

/* GET JWT for authorized user. */

// create poll
router.post("/", jwtmiddleware, Polls.createPoll);

// update poll
router.put("/", jwtmiddleware, Polls.updatePoll);

// get polls
router.get("/", jwtmiddleware, Polls.getAllPolls);

// get poll
router.get("/:id", jwtmiddleware, Polls.getPoll);

// delete poll
router.delete("/:id", jwtmiddleware, async function(req, res) {
  
});


/*router.post("/", jwtmiddleware, async function(req, res, next) {
  
});
router.post("/", jwtmiddleware, async function(req, res, next) {
  
}); */

module.exports = router;
