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
      email: 'admin@realtimepolling.com',
      role:roleId,
      password: Buffer.from('passw0rd!').toString('base64'),
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
