'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 await queryInterface.renameTable('ParkingSlots', 'parking_slots');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable('parking_slots', 'ParkingSlots');
  }
};
