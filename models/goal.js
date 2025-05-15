'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Goal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Goal.init({
    uuid: DataTypes.UUID,
    userUuid: DataTypes.UUID,
    title: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.TEXT,
    priority: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    frequency: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    isCompleted: DataTypes.BOOLEAN,
    wasAchieved: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Goal',
  });
  return Goal;
};