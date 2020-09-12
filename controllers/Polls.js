const { Polls } = require("../models");
const { PollQuestions } = require("../models");
const { PollOptions } = require("../models");

const { generateUuid } = require("./../helpers/uuid");
const jwt = require("jsonwebtoken");

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
      return res
        .status(400)
        .json({
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
          return res
            .status(400)
            .json({
              error: "Invalid Request",
              message: "Question title is black."
            });
        }
        if (
          request.questions[i].options === undefined ||
          request.questions[i].options.length == 0
        ) {
          httpStatusCode = 400;
          return res
            .status(400)
            .json({
              error: "Invalid Request",
              message: "Atleast one option is required to publish a poll"
            });
          break;
        }
      }
    }

    let uuid = generateUuid(6);
    let token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let user_id = decoded.id;
    let pollParams = {
      title: request.title || "Title",
      description: request.description || "",
      status: request.status || "Draft",
      start_date: request.start_date || new Date(),
      end_date: request.end_date || "",
      uuid,
      user_id
    };
    const poll = await Polls.create(pollParams);
    let { id } = poll;
    let questions = [];
    if(request.questions !== undefined && request.questions.length){
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
        }else{
          questionRes.push({ ...qRes.dataValues, options: [] });
        }
      }
    }
    return res.status(201).json({
      poll,
      questions : questionRes
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updatePoll = async (req, res) => {
  try {
    return res.status(201).send("uodatePoll");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getPoll = async (req, res) => {
  try {
    let pollId = req.params.id;
    let polls = await Polls.findAll({
      where: {
        uuid: pollId
      }
    });
    return res.status(200).json(polls[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const getAllPolls = async (req, res) => {
  try {
    let pollsAttributes = [
      'uuid', 'title', 'description', 'status'
    ];
    let pollQuestionsAttributes = [
      'id', 'question',
    ];
    let pollOptionsAttributes = [
      'id', 'option'
    ];
    
    let polls = await Polls.findAll({
      attributes:pollsAttributes,
      include: [
        {
          model: PollQuestions,
          as:'questions',
          attributes:pollQuestionsAttributes,
          include:[
            {
              model: PollOptions,
              as:'options',
              attributes:pollOptionsAttributes
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


module.exports = {
  createPoll,
  updatePoll,
  getPoll,
  getAllPolls
};
