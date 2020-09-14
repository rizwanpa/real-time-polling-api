require('dotenv').config();
var express = require("express");
var router = express.Router();
const { Polls, PollResponse } = require("../models");
const { submitPoll } = require('../queues/submitandnotify')

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
      
      // add to queue and send response via socket
      submitPoll.add(finalRequest)
      // await PollResponse.bulkCreate(finalRequest);
      res.status(200).json({
        message:'Your response is successfully submitted.'
      })
    }
  } catch(err) {
    console.error(err);
  }
});

module.exports = router;
