const {
    Polls,
    PollQuestions,
    PollOptions
  } = require("../models");
  
  const { generateUuid } = require("./../helpers/uuid");
  const jwt = require("jsonwebtoken");
  const { Op } = require("sequelize");


  const getPoll = async (req, res) => {
    try {
      let pollId = req.params.id !== undefined ? req.params.id : req.body.id;
      let poll = await Polls.findAll({
        where: {
            status : 'published',
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
      poll = JSON.parse(JSON.stringify(poll));
      return res.status(200).json(poll);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  module.exports = {
      getPoll
  }