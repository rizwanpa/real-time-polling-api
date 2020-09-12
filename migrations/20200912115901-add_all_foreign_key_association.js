'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint('Users', {
        fields: ['role'],
        type: 'foreign key',
        name: 'user_role_constraint',
        references: {
          table: 'Role',
          field: 'id'
        }
      }),
      queryInterface.addConstraint('Polls', {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'user_poll_id_constraint',
        references: {
          table: 'Users',
          field: 'id'
        }
      }),
      queryInterface.addConstraint('PollQuestions', {
        fields: ['poll_id'],
        type: 'foreign key',
        name: 'question_poll_id_constraint',
        references: {
          table: 'Polls',
          field: 'id'
        },
        onDelete: 'cascade',
      }),
      queryInterface.addConstraint('PollOptions', {
        fields: ['question_id'],
        type: 'foreign key',
        name: 'poll_option_id_constraint',
        references: {
          table: 'PollQuestions',
          field: 'id'
        },
        onDelete: 'cascade',
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeConstraint('Users', 'role'),
      queryInterface.removeConstraint('Polls', 'user_id'),
      queryInterface.removeConstraint('PollQuestions', 'poll_id'),
      queryInterface.removeConstraint('PollOptions', 'question_id')
    ]);
  }
};
