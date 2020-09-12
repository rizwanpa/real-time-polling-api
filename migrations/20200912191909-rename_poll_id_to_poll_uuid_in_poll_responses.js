'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn(
        'PollResponses',
        'poll_id',
        'poll_uuid'
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.renameColumn(
      'PollResponses',
      'poll_uuid',
      'poll_id'
    )
  }
};
