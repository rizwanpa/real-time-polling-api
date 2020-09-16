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

// get poll result
router.get("/result/:uuid", jwtmiddleware, Polls.getResult);

// get poll
router.get("/:id", jwtmiddleware, Polls.getPoll);

// delete poll
router.delete("/:id", jwtmiddleware, Polls.deletePoll);
/* 
* URI : http://localhost:3030/polls/getTopPolls
* Params : JSON object
* {
  status: 'published',
  sort: 'end_date', // start_date, totalResponses 
  order: 'desc',
  limit: 5,
  range: {
    fromDate:'',
    toDate:''
  },
  title: '',
}
*
*/

router.post("/getTopPolls", jwtmiddleware, Polls.getTopPolls);


/*router.post("/", jwtmiddleware, async function(req, res, next) {
  
});
router.post("/", jwtmiddleware, async function(req, res, next) {
  
}); */

module.exports = router;
