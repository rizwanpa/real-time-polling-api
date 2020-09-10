'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return Promise.all([
      queryInterface.renameColumn('Polls', 'question', 'title', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.renameColumn('Polls', 'type', 'description', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn(
        'Polls', // table name
        'user_id', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Polls', // table name
        'status', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // logic for reverting the changes
    return Promise.all([
      queryInterface.renameColumn('Polls', 'title', 'question', {
        type: Sequelize.STRING,
        allowNull : true
      }),
      queryInterface.renameColumn('Polls', 'description', 'type', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.removeColumn('Polls', 'user_id'),
      queryInterface.removeColumn('Polls', 'status'),
    ]);
  }
};
