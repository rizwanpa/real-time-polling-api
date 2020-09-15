const Queue = require('bull');
const submitPoll = new Queue('submitPoll', process.env.REDIS_URL);
const { PollResponse } = require("../models");

submitPoll.process((job, done) => {
  console.log('created poll HERE', job.id);
  PollResponse.bulkCreate(job.data).then(() => {
    console.log('Completed job', job.id);
    // console.log('process response and update ProcessResult table')
    PollResult.bulkCreate().then(() => {
      done();
    })
  });
});

module.exports = {submitPoll};