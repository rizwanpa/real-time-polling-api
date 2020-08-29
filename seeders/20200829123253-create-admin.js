'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roleId = await queryInterface.rawSelect('Roles', {
      where: {
        name: 'admin',
      },
    }, ['id']);
    return queryInterface.bulkInsert('Users', [{
      name: 'Admin',
      email: 'admin@example.com',
      role:roleId,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
