'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("PollOptions", "question_id", {
        type: Sequelize.INTEGER,
        allowNull: false
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('PollOptions', 'question_id')
    ]);
  }
};
