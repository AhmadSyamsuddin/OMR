'use strict';

const { hashPassword } = require('../helpers/bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        fullName: 'testuser',
        email: 'test@example.com',
        password: hashPassword('testpassword'), 
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    let workoutClass = require('../data/workoutclass.json');
    workoutClass = workoutClass.map(wc => ({
      ...wc,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await queryInterface.bulkInsert('WorkoutClasses', workoutClass);

    let exercises = require('../data/exercise.json');
    let exercisesWithTimestamps = exercises.map(exercise => ({
      ...exercise,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await queryInterface.bulkInsert('Exercises', exercisesWithTimestamps);
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('WorkoutClasses', null, {});
    await queryInterface.bulkDelete('Exercises', null, {});
  }
};
