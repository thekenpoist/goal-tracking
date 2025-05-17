'use strict'
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class GoalLog extends Model {
        static associate(models) {
            GoalLog.belongsTo(models.Goal, {
                foreignKey: 'goalUuid',
                targetKey: 'uuid',
                onDelete: 'CASCADE'
            });

            GoalLog.belongsTo(models.User, {
                foreignKey: 'userUuid',
                targetKey: 'uuid',
                onDelete: 'CASCADE'
            })
        }
    }

    GoalLog.init({
        uuid: {
            type:DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        goalUuid: {
            type:DataTypes.UUID,
            allowNull: false
        },
        userUuid: {
            type:DataTypes.UUID,
            allowNull: false
        },
        sessionDate: {
            type: DataTypes.DATE
        },
        edited: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'GoalLog',
        tableName: 'goal_logs',
        timestamps: true
    });
    
    return GoalLog;
};