'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     /**
     * Adding unique constrain with poll_id,question_id, opetion_d.
     *
     * 
     */
    return Promise.all([
      queryInterface.addConstraint('PollResults', {
        fields: ['poll_id','question_id','option_id'],
        type: 'unique',
        name: 'result_unique_constraint'
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Reverting unique key constrain.
     *
     */
    return Promise.all([
      queryInterface.removeConstraint('PollResults', 'result_unique_constraint')
    ])
  }
};
