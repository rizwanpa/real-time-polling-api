const { Polls } = require("../models");
const { PollQuestions } = require("../models");
const { PollOptions } = require("../models");

console.log("########### PollQuestions", PollQuestions);
console.log("########### PollOptions", PollOptions);

const createPoll = async (req, res) => {
  try {
    let request = req.body;
    console.log("CreatePoll--->@@@@@@", request);
    let httpStatusCode;

    /* Validations */
    console.log('+++++++++++++++++++ CONDITIONS',request.poll.status === 'published' && request.questions === undefined );
    if (!("title" in request.poll)) {
      console.log('title');
      httpStatusCode = 400;
      return res.status(400).json({ error: 'Invalid Request', message: 'Poll title is missing.' });
    }
    if (!("status" in request.poll)) {
      console.log('status');
      httpStatusCode = 400;
      return res.status(400).json({ error: 'Invalid Request', message: 'Poll status is missing.' });
    }
    if(request.poll.status === 'published' && request.questions === undefined){
      console.log('published and undefined');
      httpStatusCode = 400;
      return res.status(400).json({ error: 'Invalid Request', message: 'Question and its options are mandatory to publish a poll' });
    }/* else if(request.questions.options === undefined){
      console.log('else published and option');
      return res.status(400).json({ error: 'Invalid Request', message: 'Question and its options are mandatory to publish a poll' });
    } */
    if(request.poll.status === 'published' && request.questions !== undefined){
      console.log('inside-- published and !undefined');
      if(request.questions.length == 0){
        console.log('inside-- published and length');
        httpStatusCode = 400;
        return res.status(400).json({ error: 'Invalid Request', message: 'Question and its options are mandatory to publish a poll' });
      }
    }/* else if(request.questions.options !== undefined){
      console.log('inside else-- published and !undefined');
      if(request.questions.options.length == 0){
        console.log('inside else if-- published and length');
        httpStatusCode = 400;
        return res.status(400).json({ error: 'Invalid Request', message: 'Question and its options are mandatory to publish a poll' });
      }
    } */

    //check status

    // res.status(httpStatusCode);
    /* switch (httpStatusCode) {
      case 400:
        return res.status(400).json({ error: 'Invalid Request', message: '' });
        break;
    } */

    const poll = await Polls.create(request.poll);
    let { id } = poll;
    let questions = request.questions.map(val => {
      return { ...val, poll_id: id };
    });
    let questionRes = [];
    if(questions !== undefined){
      for (let i = 0; i < questions.length; i++) {
        let qRes = await PollQuestions.create(questions[i]);
        let { options } = questions[i];
          if(options !== undefined){
          options = options.map(val => {
            return { ...val, question_id: qRes.id };
          });
        }
        let optionRes = await PollOptions.bulkCreate(options);
        questionRes.push({ ...qRes.dataValues, options: optionRes });
      }
    }
    return res.status(201).json({
      poll,
      questionRes
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPoll
};
