"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // rename table name from parkingUsers to parking_users
    // await queryInterface.renameTable("ParkingUsers", "parking_users");

    //change role column value
    await queryInterface.changeColumn("parking_users", "role", {
      type: Sequelize.ENUM("customer", "admin", "owner"),
      defaultValue: "customer",
    });
  },

  async down(queryInterface, Sequelize) {
    // rename table name from parking_users to "ParkingUsers"
    await queryInterface.renameTable("parking_users", "ParkingUsers");
  },
};
