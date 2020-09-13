'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint('PollResponses', {
        fields: ['poll_id'],
        type: 'foreign key',
        name: 'poll_response_poll_id_constraint',
        references: {
          table: 'Polls',
          field: 'id'
        }
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeConstraint('PollResponses', 'poll_id')
    ])
  }
};
