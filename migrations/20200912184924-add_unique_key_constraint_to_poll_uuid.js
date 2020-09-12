'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint('Polls', {
        fields: ['uuid'],
        type:'unique',
        name:'uuid_unique_constraint'
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeIndex('Polls', 'uuid_unique_constraint')
    ]);
  }
};
