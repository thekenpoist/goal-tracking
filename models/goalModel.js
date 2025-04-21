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
    constructor(userId, goalId, title, category, description, priority, startDate, endDate, createdAt, updatedAt, isCompleted) {
        this.userId = userId;
        this.goalId = goalId;
        this.title = title;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = updatedAt || new Date().toISOString();
        this.isCompleted = isCompleted ?? false;
    }

    async saveGoals() {

        try {
            const goals = (await getGoalsFromFile()).filter(goal => goal.goalId !== this.goalId);
            goals.push(this);
            await fsPromises.writeFile(p, JSON.stringify(goals, null, 2));
        } catch (err) {
            console.error(`Failed to save goal with ID ${this.goalId}:`, err);
        }
    }

    static async fetchAll() {
        return getGoalsFromFile();
    }

    static async getGoalsByUserId(userId) {
        const goals = await getGoalsFromFile();
        return goals.find(u => u.uuid == userId);

    }


};