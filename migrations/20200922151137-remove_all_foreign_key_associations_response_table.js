'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeConstraint('PollResponses', 'poll_response_poll_id_constraint'),
      queryInterface.removeConstraint('PollResponses', 'poll_response_question_id_constraint'),
      queryInterface.removeConstraint('PollResponses', 'poll_response_option_id_constraint')
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint('PollResponses', {
        fields: ['poll_id'],
        type: 'foreign key',
        name: 'poll_response_poll_id_constraint',
        references: {
          table: 'Polls',
          field: 'id'
        }
      }),
      queryInterface.addConstraint('PollResponses', {
        fields: ['question_id'],
        type: 'foreign key',
        name: 'poll_response_question_id_constraint',
        references: {
          table: 'PollQuestions',
          field: 'id'
        }
      }),
      queryInterface.addConstraint('PollResponses', {
        fields: ['option_id'],
        type: 'foreign key',
        name: 'poll_response_option_id_constraint',
        references: {
          table: 'PollOptions',
          field: 'id'
        }
      }),      
    ])
  }
};
