'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable("ParkingLots", "parking_lots");
  },

  async down (queryInterface, Sequelize) {
       await queryInterface.renameTable("parking_lots", "ParkingLots");

  }
};
