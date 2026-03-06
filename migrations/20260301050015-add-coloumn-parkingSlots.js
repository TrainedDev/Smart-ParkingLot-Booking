'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn("parking_slots", "createdAt", {
      type: Sequelize.DATE,
      defaultValue: Date.now()
    });
    await queryInterface.addColumn("parking_slots", "updatedAt", {
      type: Sequelize.DATE,
      defaultValue: Date.now()
    });
  }
};
