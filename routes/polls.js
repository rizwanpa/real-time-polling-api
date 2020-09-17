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
* Method : POST
* Params : JSON object
* {
	"status": "published", (OPTIONAL)
    "sort": "end_date", (OPTIONAL)
    "order": "desc", (OPTIONAL)
    "limit": 5, (OPTIONAL-> dafault limit is 100)
    "fromDate":"1231324234", (OPTIONAL)
    "endDate" : "2324234234", (OPTIONAL)
    "title": "tit" (OPTIONAL)
}
*
*/

router.post("/getTopPolls", jwtmiddleware, Polls.getTopPolls);

module.exports = router;
