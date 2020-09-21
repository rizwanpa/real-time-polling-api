require('dotenv').config();
var express = require("express");
var router = express.Router();
const { Polls, PollResponse } = require("../models");

// submit poll


module.exports = (getIOInstance) => {
  router.post("/", async (req, res) => {
    try {
      const { submitPoll } = require('../queues/submitandnotify')(getIOInstance);
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
        try {
          submitPoll.add({id :poll.id, finalRequest});
          res.status(200).json({
            message:'Your response is successfully submitted.'
          });
        } catch(err) {
          return res.status(422).json({
            message: 'There was an unexpected error submitting your advert.',
          });
        }
        //await PollResponse.bulkCreate(finalRequest);
      }
    } catch(err) {
      console.error(err);
    }
  });
  return router;
}
