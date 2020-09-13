require('dotenv').config();
var express = require("express");
var router = express.Router();
const { Polls, PollResponse } = require("../models");

// submit poll
router.post("/", async (req, res) => {
  try {
    let pollResponse = req.body;
    console.log(pollResponse)
    let polls = await Polls.findAll({
      where: {
        uuid: pollResponse.uuid
      }
    });
    if(polls[0]) {
      let finalRequest = [];
      let poll = polls[0];

      pollResponse.questions.forEach((question) => {
        question.options.forEach((option) => {
          finalRequest.push({
            poll_id:poll.id,
            question_id: question.id,
            option_id:option
          })
        })
      })
      let resp = await PollResponse.bulkCreate(finalRequest);
      res.json({resp})
    }
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;
