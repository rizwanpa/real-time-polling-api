'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PollQuestions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PollQuestions.belongsTo(models.Polls, {
        foreignKey: 'poll_id',
        onDelete: 'CASCADE'
      });
      PollQuestions.hasMany(models.PollOptions,{
        as:'options',
        foreignKey: 'question_id'
      });
    }
  };
  PollQuestions.init({
    poll_id: DataTypes.INTEGER,
    question: DataTypes.STRING,
    type: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PollQuestions',
  });
  return PollQuestions;
};