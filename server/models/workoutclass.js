'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkoutClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WorkoutClass.hasMany(models.User_WorkoutClass, { foreignKey: 'WorkoutClassId' });
    }
  }
  WorkoutClass.init({
    name: DataTypes.STRING,
    coach: DataTypes.STRING,
    coachProfilePictureUrl: DataTypes.STRING,
    day: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    quota: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'WorkoutClass',
  });
  return WorkoutClass;
};