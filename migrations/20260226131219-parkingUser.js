"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "ParkingUsers",
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true,
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          isEmail: {
            msg: "provide correct email",
          },
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        role: {
          type: Sequelize.ENUM("customer" || "admin" || "owner"),
          defaultValue: "customer",
        },
      },
      {
        timestamps: true,
        tableName: "parkingUsers",
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ParkingUsers");
  },
};
