'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'isMembership', Sequelize.BOOLEAN, {
      defaultValue: false
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'isMembership');
  }
};
