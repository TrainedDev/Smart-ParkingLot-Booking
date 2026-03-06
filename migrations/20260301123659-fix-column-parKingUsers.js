'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.changeColumn("parking_users", "role", {
        type: Sequelize.STRING,
        validate:{
          isIn: [["customer", "owner", "admin"]],
          msg: "role must be either customer, owner or admin",
        },
        defaultValue: "customer",
      }, )
    }
};
