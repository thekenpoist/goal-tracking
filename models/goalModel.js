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
            type: DataTypes.DATE
        },
        endDate: {
            type: DataTypes.DATE
        },
        frequency: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        duration: {
            type: DataTypes.INTEGER, // Hey Steve, be thinking in minutes, but not yet certain
            allowNull: true
        },
        isCompleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        wasAchieved: {
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