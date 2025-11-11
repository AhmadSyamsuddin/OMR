'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('WorkoutClasses', 'currentQuota', Sequelize.INTEGER);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('WorkoutClasses', 'currentQuota');
  }
};
