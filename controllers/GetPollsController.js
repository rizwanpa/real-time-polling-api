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


const getPoll = async (req, res, action = "") => {
  try {
    let pollId = req.params.id !== undefined ? req.params.id : req.body.id;
    let pollsAttributes = ["id", "uuid", "title", "description", "status", "start_date", "end_date"];
    let pollQuestionsAttributes = ["id", "question","type"];
    let pollOptionsAttributes = ["id", "option"];
    let polls = await Polls.findAll({
      where: {
        [Op.or]: [{ id: pollId }, { uuid: pollId }]
      },
      attributes:pollsAttributes,
      include: [
        {
          model: PollQuestions,
          as: "questions",
          attributes:pollQuestionsAttributes,
          include: [
            {
              model: PollOptions,
              as: "options",
              attributes:pollOptionsAttributes
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
          if (option !== "total") {
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

const getRandomColor = () => '#'+Math.floor(Math.random()*16777215).toString(16);

const getTopPolls = async (req, res) => {
  try {
    let request = req.body;
    let pollsAttributes = ["id", "uuid", "title", "description", "status"];
    let pollQuestionsAttributes = ["id", "question"];
    let pollOptionsAttributes = ["id", "option"];
    let where = {};
    if (request.status !== undefined && request.status !== "") {
      where = {
        ...where,
        status: request.status
      };
    }
    if (request.fromDate !== undefined && request.fromDate !== "") {
      where = {
        ...where,
        start_date: {
          $gte: request.fromDate
        }
      };
    }
    if (request.endDate !== undefined && request.endDate !== "") {
      where = {
        ...where,
        end_date: {
          $lte: request.endDate
        }
      };
    }
    if (request.title !== undefined && request.title !== "") {
      where = {
        ...where,
        title: {
          [Op.like]: `%${request.title}%`
        }
      };
    }
    let limit = 100;
    if (request.limit !== undefined && request.limit !== "") {
      limit = request.limit;
    }
    let polls = await Polls.findAll({
      attributes: pollsAttributes,
      limit: limit,
      where: where,
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

    polls = JSON.parse(JSON.stringify(polls));
    for (
      let pollIndex = 0;
      pollIndex < Object.keys(polls).length;
      pollIndex++
    ) {
      let poll_id = polls[pollIndex].id;
      for (
        let questionIndex = 0;
        questionIndex < Object.keys(polls[pollIndex].questions).length;
        questionIndex++
      ) {
        let question_id = polls[pollIndex].questions[questionIndex].id;
        for (
          let optionIndes = 0;
          optionIndes <
          Object.keys(polls[pollIndex].questions[questionIndex].options).length;
          optionIndes++
        ) {
          let option_id =
            polls[pollIndex].questions[questionIndex].options[optionIndes].id;
          let resultRes = await PollResult.findOne({
            where: { poll_id, question_id, option_id },
            attributes: ["percentage"]
          });
          let percentage =
            resultRes !== undefined && resultRes !== null
              ? resultRes.percentage
              : 0;
          polls[pollIndex].questions[questionIndex].options[
            optionIndes
          ].percentage = percentage;
          polls[pollIndex].questions[questionIndex].options[
            optionIndes
          ].color = getRandomColor();
        }
      }
    }

    return res.status(200).json(polls);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPoll,
  getAllPolls,
  getResult,
  getTopPolls
};
