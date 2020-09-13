'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint('PollResponses', {
        fields: ['option_id'],
        type: 'foreign key',
        name: 'poll_response_option_id_constraint',
        references: {
          table: 'PollOptions',
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
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeConstraint('PollResponses', 'option_id'),
      queryInterface.removeConstraint('PollResponses', 'question_id')
    ])
  }
};
