'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.belongsTo(models.Role, {
        foreignKey: 'role'
      });
      Users.hasMany(models.Polls,{
        as:'polls',
        foreignKey: 'user_id'
      })
    }
  };
  Users.init({
    name: DataTypes.STRING,
    role: DataTypes.INTEGER,
    email: DataTypes.STRING,
    mobile: DataTypes.INTEGER,
    password:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};