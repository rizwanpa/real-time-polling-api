const {
    Polls,
    PollQuestions,
    PollOptions
  } = require("../models");
  
  
  const { Op } = require("sequelize");


  const getPoll = async (req, res) => {
    try {
      let pollId = req.params.id !== undefined ? req.params.id : req.body.id;
      let currentDateTime = Math.floor(Date.now()/1000)
      console.log('====>',currentDateTime, typeof currentDateTime);
      let poll = await Polls.findAll({
        where: {
            status : 'published',
            start_date: {
              [Op.lte]: currentDateTime
            },
            end_date: {
              [Op.gte]: currentDateTime
            },
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