"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("PollResponses", "question_id", {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      queryInterface.addColumn("PollResponses", "time_taken", {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("PollResponses", "question_id"),
      queryInterface.removeColumn("PollResponses", "time_taken")
    ]);
  }
};
