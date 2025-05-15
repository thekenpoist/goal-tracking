'use strict'
const { Model, DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
    class Goal extends Model {
        static associate(models) {
            Goal.belongsTo(models.User, {
                foreignKey: 'userUudi',
                targetKey: 'uuid',
                onDelete: 'CASCADE'
            });
        }
    }
};