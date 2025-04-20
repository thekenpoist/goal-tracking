const fsPromises = require('fs').promises;
const path = require('path');
const { error } = require('console');

const p = path.join(__dirname, '..', 'data', 'goals.json');

const getGoalsFromFile = async () => {
    try {
        const fileContent = await fsPromises.readFile(p, 'utf-8');
        return JSON.parse(fileContent);
    } catch (err) {
        console.warn('Error reading goals.json. Returning empty array.');
        return [];
    }
};

module.exports = class Goal {
    constructor(userId, goalId, goalTitle, goalCategory, goalStartdate, goalEnddate, createdAt, updatedAt, isCompleted) {
        this.userId = userId;
        this.goalId = goalId;
        this.goalTitle = goalTitle;
        this.goalCategory = goalCategory;
        this.goalStartdate = goalStartdate;
        this.goalEnddate = goalEnddate;
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = updatedAt || new Date().toISOString();
        this.isCompleted = isCompleted;
    }

}