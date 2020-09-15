'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PollResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PollResult.init({
    poll_id: DataTypes.INTEGER,
    question_id: DataTypes.INTEGER,
    option_id: DataTypes.INTEGER,
    percentage: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PollResult',
  });
  return PollResult;
};