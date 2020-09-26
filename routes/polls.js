require('dotenv').config();
var express = require("express");
var router = express.Router();
const jwtmiddleware = require('../jwt/jwtmiddleware');
const Polls  = require('../controllers/GetPollsController');
const {deletePoll, deletePollOption, deletePollQuestion} = require('../controllers/DeletePollController');
const {createPoll} = require('../controllers/CreatePollController');
const {updatePoll} = require('../controllers/UpdatePollController');


const Sequelize = require('sequelize');
const bodyParser = require('body-parser');

/* GET JWT for authorized user. */

// create poll
router.post("/", jwtmiddleware, createPoll);

// update poll
router.put("/", jwtmiddleware, updatePoll);

// get polls
router.get("/", jwtmiddleware, Polls.getAllPolls);

// get poll result
router.get("/result/:uuid", jwtmiddleware, Polls.getResult);

// get poll
router.get("/:id", jwtmiddleware, Polls.getPoll);

// delete poll
router.delete("/:id", jwtmiddleware, deletePoll);
/* 
* URI : http://localhost:3030/polls/getTopPolls
* Method : POST
* Params : JSON object (All params are optional)
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

/* 
* URI : http://localhost:3030/deleteOption/:optionId
* Method : DELETE
* Params : option id [*mandatory]* 
*
*/
router.delete("/deleteOption/:optionId", jwtmiddleware, deletePollOption);


/* 
* URI : http://localhost:3030/deleteQuestion/:questionId
* Method : DELETE
* Params : Question id [*mandatory]* 
*
*/
router.delete("/deleteQuestion/:questionId", jwtmiddleware, deletePollQuestion);

module.exports = router;
