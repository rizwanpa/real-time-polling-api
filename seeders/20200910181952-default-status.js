'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Statuses', [{
      type: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: 'published',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Statuses', null, {});
  }
};