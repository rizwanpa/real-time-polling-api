'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('PollResponses', 'poll_uuid', 'poll_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('PollResponses', 'poll_id', 'poll_uuid', {
        type: Sequelize.INTEGER,
        allowNull: false,
      })
    ]);
  }
};
