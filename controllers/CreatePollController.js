const {
  Polls,
  PollQuestions,
  PollOptions,
  PollResponse,
  PollResult
} = require("../models");

const { generateUuid } = require("../helpers/uuid");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
/* 
  This API will create new poll.
*/
const createPoll = async (req, res) => {
  try {
    let requestBody = req.body;
    let httpStatusCode;

    /* Validations */
    if (requestBody === undefined) {
      httpStatusCode = 400;
      return res
        .status(400)
        .json({ error: "Invalid Request", message: "Request is missing." });
    }
    if (!("title" in requestBody) || requestBody.title === "") {
      httpStatusCode = 400;
      return res
        .status(400)
        .json({ error: "Invalid Request", message: "Poll title is missing." });
    }
    if (!("status" in requestBody) || requestBody.title === "") {
      httpStatusCode = 400;
      return res
        .status(400)
        .json({ error: "Invalid Request", message: "Poll status is missing." });
    }
    if (
      requestBody.status === "published" &&
      (requestBody.questions === undefined || requestBody.questions.length == 0)
    ) {
      httpStatusCode = 400;
      return res.status(400).json({
        error: "Invalid Request",
        message: "Question and its options are mandatory to publish a poll"
      });
    }
    if (
      requestBody.status === "published" &&
      (requestBody.questions !== undefined || requestBody.questions.length)
    ) {
      for (let i = 0; i < requestBody.questions.length; i++) {
        if (
          requestBody.questions[i].question === undefined ||
          requestBody.questions[i].question === null ||
          requestBody.questions[i].question === ""
        ) {
          return res.status(400).json({
            error: "Invalid Request",
            message: "Question title is black."
          });
        }
        if (
          requestBody.questions[i].options === undefined ||
          requestBody.questions[i].options.length == 0
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
      title: requestBody.title || "Title",
      description: requestBody.description || "",
      status: requestBody.status || "Draft",
      start_date: requestBody.start_date || Date.now(),
      end_date: requestBody.end_date || Date.now() + 24 * 60 * 60 * 1000,
      uuid,
      user_id
    };
    const poll = await Polls.create(pollParams);
    let { id } = poll;
    let questions = [];
    if (requestBody.questions !== undefined && requestBody.questions.length) {
      questions = requestBody.questions.map(val => {
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

module.exports = {
    createPoll
};
