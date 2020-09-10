'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('PollOptions', 'poll_id', 'question_id', {
        type: Sequelize.STRING,
        allowNull: false,
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('PollOptions', 'question_id', 'poll_id', {
        type: Sequelize.STRING,
        allowNull: false,
      })
    ]);
  }
};
