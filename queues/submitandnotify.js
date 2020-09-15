const Queue = require('bull');
const submitPoll = new Queue('submitPoll', process.env.REDIS_URL);
const { PollResponse } = require("../models");

submitPoll.process(async pollResponse => {
  try {
    console.log('submit queue===>',pollResponse);
    await PollResponse.bulkCreate(finalRequest);
    // store 
    
    // send message through socket
  } catch (err) {
      return Promise.reject(err);
  }
});

module.exports = {submitPoll};