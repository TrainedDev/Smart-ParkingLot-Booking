'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("parking_bookings", "customer_id" , {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "parking_users",
        key: "id"
      },
      onDelete: "CASCADE"
    })
  }
};
