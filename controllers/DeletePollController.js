const {
  Polls,
  PollQuestions,
  PollOptions
} = require("../models");

const { generateUuid } = require("../helpers/uuid");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
/* 
This API will delete all the entries form three tables (i.e. Polls, PollQuestions, PollOptions ) matching poll id or poll uuid
*/
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
    polls = JSON.parse(JSON.stringify(polls));
    if (!polls.length) {
      return res.status(404).json(`Record not found`);
    }
    polls = polls[0];
    if (polls.questions !== undefined) {
        let questionIds = polls.questions.map(val => val.id);
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@polls++++++++", questionIds.length);
      if (questionIds.length) {
        PollOptions.destroy({ where: { id: questionIds } }).then(
          deleteOptions => {
            PollQuestions.destroy({ where: { id: polls.id } }).then(
              deleteQueston => {
                Polls.destroy({ where: { id: polls.id } }).then(
                  deletePollRec => {
                    return res
                      .status(200)
                      .json(`Poll ${pollId} deleted successfully`);
                  }
                );
              }
            );
          }
        );
      } else {
        Polls.destroy({ where: { id: polls.id } }).then(deletePollRec => {
          return res.status(200).json(`Poll ${pollId} deleted successfully`);
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deletePoll
};
