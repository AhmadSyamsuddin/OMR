'use strict';
const { hashPassword } = require('../helpers/bcrypt');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.User_WorkoutClass, { foreignKey: 'UserId' });
    }
  }
  User.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Full name is required' },
        notEmpty: { msg: 'Full name cannot be empty' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Email is required' },
        notEmpty: { msg: 'Email cannot be empty' },
        isEmail: { msg: 'Must be a valid email address' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Password is required' },
        notEmpty: { msg: 'Password cannot be empty' },
        len: {
          args: [6, 100],
          msg: 'Password must be at least 6 characters long'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (instance) => {
        instance.password = hashPassword(instance.password);
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};