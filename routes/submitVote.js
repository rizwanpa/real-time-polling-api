require('dotenv').config();
var express = require("express");
var router = express.Router();
const Vote  = require('../controllers/SubmitVoteController');


// get poll
/* 
* URI : http://localhost:3030/submitvote/${uuid}
* Method : GET
* Params : uuid - Poll uuid and its mandatory
* 
*
*/
router.get("/:id", Vote.getPoll);

module.exports = router;
