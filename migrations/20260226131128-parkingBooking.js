'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("ParkingBookings", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    issuedSlotNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    startingTimer: {
        type: Sequelize.DATE,
        allowNull: false
    },
    endingTimer: {
        type: Sequelize.DATE,
        allowNull: false
    },
    status: {
      type: Sequelize.ENUM("cancelled", "completed", "active"),
      defaultValue: "active",
    },
  }, {
    timestamps: true,
    tableName: "parkingBookings",
  })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("ParkingBookings");
  }
};
