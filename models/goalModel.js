'use strict'
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Goal extends Model {
        static associate(models) {
            Goal.belongsTo(models.User, {
                foreignKey: 'userUuid',
                targetKey: 'uuid',
                onDelete: 'CASCADE'
            });
        }
    }

    Goal.init({
        uuid: {
            type:DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userUuid: {
            type:DataTypes.UUID,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        priority: {
            type: DataTypes.STRING
        },
        startDate: {
            type: DataTypes.DATEONLY
        },
        endDate: {
            type: DataTypes.DATEONLY
        },
        frequency: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        streakCounter: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        longestStreak: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lastLoggedAt: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        wasAchievedAt: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        archived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Goal',
        tableName: 'goals',
        timestamps: true
    });
    
    return Goal;
};