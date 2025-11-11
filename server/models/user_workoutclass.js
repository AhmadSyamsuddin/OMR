'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_WorkoutClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_WorkoutClass.belongsTo(models.User, { foreignKey: 'UserId' });
      User_WorkoutClass.belongsTo(models.WorkoutClass, { foreignKey: 'WorkoutClassId' });
    }
  }
  User_WorkoutClass.init({
    UserId: DataTypes.INTEGER,
    WorkoutClassId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_WorkoutClass',
  });
  return User_WorkoutClass;
};