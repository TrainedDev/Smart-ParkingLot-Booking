'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("parking_slots", "parkingLot_id" , {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "parking_lots",
        key: "id"
      },
      onDelete: "CASCADE"
    })
  }
};
