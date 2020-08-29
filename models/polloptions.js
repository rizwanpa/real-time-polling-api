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
      // define association here
    }
  };
  PollOptions.init({
    poll_id: DataTypes.INTEGER,
    option: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PollOptions',
  });
  return PollOptions;
};