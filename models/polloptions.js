'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PollOptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PollOptions.belongsTo(models.PollQuestions, {
        foreignKey: 'question_id',
        onDelete: 'CASCADE'
      });
    }
  };
  PollOptions.init({
    question_id: DataTypes.INTEGER,
    option: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PollOptions',
  });
  return PollOptions;
};