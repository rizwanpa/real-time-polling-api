const {
  Polls,
  PollQuestions,
  PollOptions,
  PollResponse,
  PollResult
} = require("../models");

const { generateUuid } = require("./../helpers/uuid");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const createPoll = async (req, res) => {
  try {
    let request = req.body;
    let httpStatusCode;

    /* Validations */
    if (request === undefined) {
      httpStatusCode = 400;
      return res
        .status(400)
        .json({ error: "Invalid Request", message: "Request is missing." });
    }
    if (!("title" in request) || request.title === "") {
      httpStatusCode = 400;
      return res
        .status(400)
        .json({ error: "Invalid Request", message: "Poll title is missing." });
    }
    if (!("status" in request) || request.title === "") {
      httpStatusCode = 400;
      return res
        .status(400)
        .json({ error: "Invalid Request", message: "Poll status is missing." });
    }
    if (
      request.status === "published" &&
      (request.questions === undefined || request.questions.length == 0)
    ) {
      httpStatusCode = 400;
      return res.status(400).json({
        error: "Invalid Request",
        message: "Question and its options are mandatory to publish a poll"
      });
    }
    if (
      request.status === "published" &&
      (request.questions !== undefined || request.questions.length)
    ) {
      for (let i = 0; i < request.questions.length; i++) {
        if (
          request.questions[i].question === undefined ||
          request.questions[i].question === null ||
          request.questions[i].question === ""
        ) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Question title is black."
          });
        }
        if (
          request.questions[i].options === undefined ||
          request.questions[i].options.length == 0
        ) {
          httpStatusCode = 400;
          return res.status(400).json({
            error: "Invalid Request",
            message: "Atleast one option is required to publish a poll"
          });
          break;
        }
      }
    }

    let uuid = await generateUuid(6);
    let token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let user_id = decoded.id;
    let pollParams = {
      title: request.title || "Title",
      description: request.description || "",
      status: request.status || "Draft",
      start_date: request.start_date || Date.now(),
      end_date: request.end_date || Date.now()+(24*60*60*1000),
      uuid,
      user_id
    };
    const poll = await Polls.create(pollParams);
    let { id } = poll;
    let questions = [];
    if (request.questions !== undefined && request.questions.length) {
      questions = request.questions.map(val => {
        return { ...val, poll_id: id };
      });
    }
    let questionRes = [];
    if (questions.length) {
      for (let i = 0; i < questions.length; i++) {
        let qRes = await PollQuestions.create(questions[i]);
        let { options } = questions[i] || {};
        if (options !== undefined) {
          options = options.map(val => {
            return { ...val, question_id: qRes.id };
          });
          let optionRes = await PollOptions.bulkCreate(options);
          questionRes.push({ ...qRes.dataValues, options: optionRes });
        } else {
          questionRes.push({ ...qRes.dataValues, options: [] });
        }
      }
    }
    return res.status(201).json({
      poll,
      questions: questionRes
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updatePoll = async (req, res) => {
  try {
    let request = req.body;
    let httpStatusCode;

    /* Validations */
    if (request === undefined) {
      httpStatusCode = 400;
      return res
        .status(400)
        .json({ error: "Invalid Request", message: "Request is missing." });
    }
    if (!("title" in request) || request.title === "") {
      httpStatusCode = 400;
      return res
        .status(400)
        .json({ error: "Invalid Request", message: "Poll title is missing." });
    }
    if (!("status" in request) || request.title === "") {
      httpStatusCode = 400;
      return res
        .status(400)
        .json({ error: "Invalid Request", message: "Poll status is missing." });
    }
    if (
      request.status === "published" &&
      (request.questions === undefined || request.questions.length == 0)
    ) {
      httpStatusCode = 400;
      return res.status(400).json({
        error: "Invalid Request",
        message: "Question and its options are mandatory to publish a poll"
      });
    }
    if (
      request.status === "published" &&
      (request.questions !== undefined || request.questions.length)
    ) {
      for (let i = 0; i < request.questions.length; i++) {
        if (
          request.questions[i].question === undefined ||
          request.questions[i].question === null ||
          request.questions[i].question === ""
        ) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Question title is black."
          });
        }
        if (
          request.questions[i].options === undefined ||
          request.questions[i].options.length == 0
        ) {
          httpStatusCode = 400;
          return res.status(400).json({
            error: "Invalid Request",
            message: "Atleast one option is required to publish a poll"
          });
          break;
        }
      }
    }
    /* Validation- End */

    let uuid = request.uuid !== undefined ? request.uuid : generateUuid(6);
    let token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let user_id = decoded.id;

    let polls = await Polls.findOne({
      where: { id: request.id }
    }).then(obj => {
      if (obj) {
        let pollParams = {
          title: request.title,
          description: request.description,
          status: request.status,
          start_date: request.start_date,
          end_date: request.end_date,
          user_id: user_id
        };
        obj.update(pollParams).then(pollUpdatedObj => {
          PollQuestions.findAll({
            where: { poll_id: request.id },
            include: [
              {
                model: PollOptions,
                as: "options"
                //attributes:pollOptionsAttributes
              }
            ]
          }).then(questionObj => {
            let questionIds = questionObj.map(val => val.id);
            /* let questionOptionArr = questionObj.map(val => {
              return {[val.id] : val.options.map(option => option.id) }
            }); */
            let { questions } = request;
            //return false;
            for (let i = 0; i < questions.length; i++) {
              console.log('@@@@@@@@@@@@@@@@@@@@@@questionObj@@@@@@@@', questionIds, questions[i].id);
              console.log(questions[i].id !== undefined, ((questions[i].id) in questionIds), questionIds.includes(questions[i].id), typeof questions[i].id);
              /* let currentOptions, requestOptions = []
              if(questionObj[i] !== undefined){
                currentOptions = questionObj[i].options.map(
                  option => option.id
                  );
                }
              if(questions[i] !== undefined){

                requestOptions = questions[i].options.map(
                  option => option.id
                  );
                }
              let destroyOptions = currentOptions.filter(function(i) {
                return this.indexOf(i) < 0;
              }, requestOptions); */
              //PollOptions.destroy({ where: { id: destroyOptions } });
              if (
                questions[i].id !== undefined &&
                (questionIds.includes(questions[i].id))
              ) {
                console.log('&&&&&&&&&&&&&&&&&&inside update questions&&&&&&&&&&', questions[i]);
                //update
                let updateQue = {
                  question: questions[i].question,
                  type: questions[i].type,
                  updatedAt: new Date()
                };
                PollQuestions.update(updateQue, {
                  where: { id: questions[i].id, poll_id: request.id }
                }).then(result => {
                  // here your result is simply an array with number of affected rows
                  //update
                  let { options } = questions[i];
                  if (options !== undefined) {
                    options = options.map(val => {
                      return { ...val, question_id: questions[i].id };
                    });
                    PollOptions.bulkCreate(options, {
                      updateOnDuplicate: ["option"]
                    }).then(optionRes => {
                      console.log('__________________BUKLCREATION UPDATE')
                      //questionRes.push({ ...qRes.dataValues, options: optionRes });
                    });
                  } else {
                    //questionRes.push({ ...qRes.dataValues, options: [] });
                  }
                  //console.log("1111111111111111111result", result);
                  // [ 1 ]
                });
              } else {
                console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5inside else %%%%%%%%%%%%%%', questions[i])
                //insert
                let updateQue = {
                  poll_id: request.id,
                  question: questions[i].question,
                  type: questions[i].type
                };
                PollQuestions.create(updateQue).then(qRes => {
                  let { options } = questions[i];
                  if (options !== undefined) {
                    options = options.map(val => {
                      return { ...val, question_id: qRes.id };
                    });
                    PollOptions.bulkCreate(options).then(optionRes => {
                      //questionRes.push({ ...qRes.dataValues, options: optionRes });
                    });
                  } else {
                    //questionRes.push({ ...qRes.dataValues, options: [] });
                  }
                  //console.log("222222222222222 insert", qRes);
                });
              }
            }
          });
        });
      }
    });
    //console.log("request-->>>>>", request);
    return res.status(200).json('Record Updated successfully');
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getPoll = async (req, res, action = "") => {
  try {
    let pollId = req.params.id !== undefined ? req.params.id : req.body.id;
    let polls = await Polls.findAll({
      where: {
        [Op.or]: [{ id: pollId }, { uuid: pollId }]
      },
      include: [
        {
          model: PollQuestions,
          as: "questions",
          //attributes:pollQuestionsAttributes,
          include: [
            {
              model: PollOptions,
              as: "options"
              //attributes:pollOptionsAttributes
            }
          ]
        }
      ]
    });
    polls = polls.length ? polls[0] : [];
    if (action === "returnVal") {
      return polls;
    } else {
      return res.status(200).json(polls);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllPolls = async (req, res) => {
  try {
    let pollsAttributes = ["id", "uuid", "title", "description", "status"];
    let pollQuestionsAttributes = ["id", "question"];
    let pollOptionsAttributes = ["id", "option"];

    let polls = await Polls.findAll({
      attributes: pollsAttributes,
      include: [
        {
          model: PollQuestions,
          as: "questions",
          attributes: pollQuestionsAttributes,
          include: [
            {
              model: PollOptions,
              as: "options",
              attributes: pollOptionsAttributes
            }
          ]
        }
      ]
    });

    return res.status(200).json(polls);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deletePoll = async (req, res, action = "") => {
  try {
    let pollId = req.params.id !== undefined ? req.params.id : req.body.id;
    let polls = await Polls.findAll({
      where: {
        [Op.or]: [{ id: pollId }, { uuid: pollId }]
      },
      include: [
        {
          model: PollQuestions,
          as: "questions",
          attributes: ["id"]
          /*  include: [
            {
              model: PollOptions,
              as: "options",
              attributes:['id','question_id']
            }
          ] */
        }
      ]
    });
    if (!polls.length) {
      return res.status(404).json(`Record not found`);
    }
    if (polls[0].questions !== undefined) {
      let questionIds = polls[0].questions.map(val => val.id);
      PollOptions.destroy({ where: { id: questionIds } }).then(
        deleteOptions => {
          PollQuestions.destroy({ where: { id: pollId } }).then(
            deleteQueston => {
              Polls.destroy({ where: { id: pollId } }).then(deletePollRec => {
                return res
                  .status(200)
                  .json(`Poll ${pollId} deleted successfully`);
              });
            }
          );
        }
      );
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getResult = async (req, res) => {
  try {
    let pollsAttributes = ["id", "uuid", "title", "description", "status"];
    let pollQuestionsAttributes = ["id", "question"];
    let pollOptionsAttributes = ["id", "option"];

    let pollUuid = req.params.uuid;
    let polls = await Polls.findAll({
      where: {
        uuid: pollUuid
      },
      attributes: pollsAttributes,
      include: [
        {
          model: PollQuestions,
          as: "questions",
          attributes: pollQuestionsAttributes,
          include: [
            {
              model: PollOptions,
              as: "options",
              attributes: pollOptionsAttributes
            }
          ]
        }
      ]
    });

    let poll = polls[0];

    let responseStructure = {};
    poll.questions.forEach(question => {
      if (!responseStructure[question.id]) {
        responseStructure[question.id] = {};
      }
      question.options.forEach(option => {
        if (!responseStructure[question.id][option.id]) {
          responseStructure[question.id][option.id] = 0;
        }
        if (!responseStructure[question.id]["total"]) {
          responseStructure[question.id]["total"] = 0;
        }
      });
    });

    /* create structure */
    if (polls[0]) {
      let pollId = polls[0].id;
      let responses = await PollResponse.findAll({
        where: {
          poll_id: pollId
        }
      });

      let resp = {};

      responses.forEach(response => {
        responseStructure[response.question_id][response.option_id]++;
        responseStructure[response.question_id].total++;
      });

      let formattedResult = {};

      for (let questionId in responseStructure) {
        if (!formattedResult[questionId]) {
          formattedResult[questionId] = {};
        }
        let options = Object.keys(responseStructure[questionId]);
        options.forEach(option => {
          if (option !== 'total') {
            formattedResult[questionId][option] = Math.round(
              (responseStructure[questionId][option] /
                responseStructure[questionId].total) *
              100
            );
          }
        });
      }

      res.json({ formattedResult });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getTopPolls = async (req, res) => {
  try {
    let request = req.body;
    //console.log('request=======',request,req.params,req.query);
    let pollsAttributes = ["id","uuid", "title", "description", "status"];
    let pollQuestionsAttributes = ["id", "question"];
    let pollOptionsAttributes = ["id", "option"];

    let polls = await Polls.findAll({
      attributes: pollsAttributes,
      include: [
        {
          model: PollQuestions,
          as: "questions",
          attributes: pollQuestionsAttributes,
          include: [
            {
              model: PollOptions,
              as: "options",
              attributes: pollOptionsAttributes
            }
          ]
        }
      ]
    });

    polls.forEach((poll)=>{
      let poll_id = poll.id;
      //console.log('~~~~~~~~~~~~~~~~~~~~~~',poll);
      poll.questions.forEach(question=>{
        let question_id = question.id;
        question.options.forEach(async option=>{
          let option_id = option.id;
          let percentage = await PollResult.findOne({
            where: { poll_id,question_id, option_id },
            attributes: ['percentage']
          })
          console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP',polls);
          //polls[poll]['questions'][question]['options'][option]

        })
      })

    });

    return res.status(200).json(polls);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPoll,
  updatePoll,
  getPoll,
  getAllPolls,
  deletePoll,
  getResult,
  getTopPolls
};
