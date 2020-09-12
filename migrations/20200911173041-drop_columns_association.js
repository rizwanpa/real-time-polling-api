'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('PollOptions', 'question_id')
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'PollOptions',
        'question_id',
        {
          type: Sequelize.INTERGER
        }
      )
    ]);
  }
};
