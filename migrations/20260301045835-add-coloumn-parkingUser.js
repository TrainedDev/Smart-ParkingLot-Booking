'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("parking_users", "createdAt", {
      type: Sequelize.DATE,
      defaultValue: Date.now()
    });
    await queryInterface.addColumn("parking_users", "updatedAt", {
      type: Sequelize.DATE,
      defaultValue: Date.now()
    });
  },
};
