'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Exercises', 'image', Sequelize.STRING);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Exercises', 'image');
  }
};
