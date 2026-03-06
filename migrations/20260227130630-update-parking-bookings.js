"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable("ParkingBookings", "parking_bookings");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable("parking_bookings", "ParkingBookings");
  },
};
