'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'category');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.createColumn('Products', {
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    })
  },
}
