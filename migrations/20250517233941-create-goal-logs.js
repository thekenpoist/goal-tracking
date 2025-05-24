'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('goal_logs', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      goalUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'goals',
          key: 'uuid'
        },
        onDelete: 'CASCADE'
      },
      userUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'uuid'
        },
        onDelete: 'CASCADE'
      },
      sessionDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      edited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('goal_logs', ['userUuid', 'goalUuid', 'sessionDate'], {
      name: 'idx_goal_logs_lookup'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('goal_logs', 'idx_goal_logs_lookup');
    await queryInterface.dropTable('goal_logs');
  }
};