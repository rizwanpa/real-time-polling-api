const Queue = require('bull');
const submitPoll = new Queue('submitPoll', process.env.REDIS_URL);
const { PollResponse, Polls, PollQuestions, PollOptions, PollResult } = require("../models");

module.exports = (getIOInstance) => {
  submitPoll.process((job, done) => {
    console.log('created poll HERE', job.id);
    PollResponse.bulkCreate(job.data.finalRequest).then(() => {
      //Getting poll based on uuid.
      let pollId = job.data.id;
      let responsesAttributes = ["poll_id", "question_id", "option_id"];
      PollResponse.findAll({
        where: {
          poll_id: pollId
        },
        attributes: responsesAttributes,
      }).then((responses) => {
  
        let questionStructure = {};
        responses.forEach(response => {
          if (!questionStructure[response.question_id]) {
            questionStructure[response.question_id] = {
              count: 0,
              options: {}
            }
          }
          if (!questionStructure[response.question_id]['options'][response.option_id]) {
            questionStructure[response.question_id]['options'][response.option_id] = {
              count: 0,
              result: 0
            }
          }
          questionStructure[response.question_id]['count']++;
          questionStructure[response.question_id]['options'][response.option_id]['count']++;
        });
        let pollResultResponse = {};
        Object.keys(questionStructure).forEach(questionId => {
          let quesCount = questionStructure[questionId].count;
          if (!pollResultResponse[questionId]) {
            pollResultResponse[questionId] = []
          }
          Object.keys(questionStructure[questionId].options).forEach(optionId => {
  
            let optionCount = questionStructure[questionId]['options'][optionId].count;
            let percentage = (optionCount / quesCount) * 100;
            pollResultResponse[questionId].push({
              option_id: optionId,
              percentage: percentage
            });
          })
        });
        
        let finalResult = Object.keys(pollResultResponse).map((question_id, index) => {
          return pollResultResponse[question_id].map((optonObj) => {
            return { poll_id: pollId, question_id, ...optonObj }
          })
        });
        
        let pollResult = [];
        for(let i=0;i < finalResult.length;i++){
          pollResult.push(...finalResult[i]);
        }
        PollResult.bulkCreate(pollResult, { updateOnDuplicate: ["percentage"] }).then((resultObj) => {
          console.log('PollResult !!!!!!!!!!!!!!!!!!!!!!!!!!!!! return value',JSON.parse(JSON.stringify(resultObj)));
          let PollResultJson = JSON.parse(JSON.stringify(resultObj));
          let updatedPollResult = {};
          
          PollResultJson.forEach(resultObj => {
            if (!updatedPollResult[resultObj.poll_id]) {
              updatedPollResult[resultObj.poll_id] = {}
            }
            if (!updatedPollResult[resultObj.poll_id][resultObj.question_id]) {
              updatedPollResult[resultObj.poll_id][resultObj.question_id] = {
                options:{}
              }
            }
            if (!updatedPollResult[resultObj.poll_id][resultObj.question_id]['options'][resultObj.option_id]) {
              let percentage = (resultObj.percentage % 1) >= 0.5 ? Math.ceil(resultObj.percentage) : Math.floor(resultObj.percentage);
              updatedPollResult[resultObj.poll_id][resultObj.question_id]['options'][resultObj.option_id] = {percentage : percentage}
            }
          });

          // send this updated result via socket by calling getIOInstance
          getIOInstance().sockets.emit('refresh-poll-list', updatedPollResult);
          

          done();
          console.log('COMPLETED HERE', job.id);
          //implemant socket here...
        })
      });
    });
  });
  return { submitPoll }
}