'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Polls', 'description', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Polls', 'description', {
        type: Sequelize.INTRGER,
        allowNull: true
      })
    ])
  }
};
