'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PollResponse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PollResponse.init({
    poll_id: DataTypes.INTEGER,
    option_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    question_id: DataTypes.INTEGER,
    time_taken: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'PollResponse',
  });
  return PollResponse;
};