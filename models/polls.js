'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Polls extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Polls.init({
    title: DataTypes.STRING,
    uuid: DataTypes.STRING,
    description: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    start_date: DataTypes.BIGINT,
    end_date: DataTypes.BIGINT,
    user_required: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Polls',
  });
  return Polls;
};