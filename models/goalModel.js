const fsPromises = require('fs').promises;
const path = require('path');

const p = path.join(__dirname, '..', 'data', 'goals.json');

const getGoalsFromFile = async () => {
    try {
        const fileContent = await fsPromises.readFile(p, 'utf-8');
        return JSON.parse(fileContent);
    } catch (err) {
        console.warn('Error reading goals.json. Returning empty array.', err);
        return [];
    }
};

module.exports = class Goal {
    constructor(goalId, userUuid, title, category, description, priority, startDate, endDate, createdAt, updatedAt, isCompleted) {
        this.goalId = goalId;
        this.userUuid = userUuid;
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

    // READ-ONLY OPERATIONS
    static async fetchAll() {
        return getGoalsFromFile();
    }

    static async getGoalsByUserId(userUuid) {
        const goals = await getGoalsFromFile();
        return goals.filter(goal => goal.userUuid === userUuid);
    }

    static async getGoalById(userUuid, goalId) {
        const goals = await getGoalsFromFile();
        return goals.find(goal => goal.userUuid === userUuid && goal.goalId === goalId);
    }

    // WRITE OPERATIONS
    static async createGoal({ userUuid, title, category, description, priority, startDate, endDate }) {
        const goals = await getGoalsFromFile();
        let nextGoalId = 1;

        const userGoals = goals.filter(goal => goal.userUuid === userUuid);
        if (userGoals.length > 0) {
            const maxGoalId = Math.max(...userGoals.map(goal => goal.goalId));
            nextGoalId = maxGoalId + 1;
        }

        const newGoal = new Goal(
            nextGoalId,
            userUuid,
            title,
            category,
            description,
            priority,
            startDate,
            endDate
        );

        await newGoal.save();
        return newGoal;
    }

    static async updateGoal(userUuid, goalId, updatedFields) {
        const goals = await getGoalsFromFile();
        const goalIndex = goals.findIndex(goal => goal.userUuid === userUuid && goal.goalId === goalId);

        if (goalIndex === -1) {
            throw new Error('Goal not found');
        }

        const { userUuid: _, goalId: __, createdAt: ___, updatedAt: ____, ...safeFields } = updatedFields;

        const updatedGoal = {
            ...goals[goalIndex],
            ...safeFields,
            updatedAt: new Date().toISOString()
        };

        goals[goalIndex] = updatedGoal;

        try {
            await fsPromises.writeFile(p, JSON.stringify(goals, null, 2));
            return updatedGoal;
        } catch (err) {
            console.error('Write error during updateGoal', err);
            throw err;
        }
    }

    static async deleteGoal(userUuid, goalId) {
        const goals = await getGoalsFromFile();
        const updatedGoals = goals.filter(goal => !(goal.userUuid === userUuid && goal.goalId === goalId));

        if (updatedGoals.length === goals.length) {
            return false;
        }

        try {
            await fsPromises.writeFile(p, JSON.stringify(updatedGoals, null, 2));
            return true;
        } catch (err) {
            console.error(`Error deleting goalId ${goalId} for userUuid ${userUuid}`, err);
            throw err;
        }
    }

    static async deleteAllGoals(userUuid) {
        const goals = await getGoalsFromFile();
        const updatedGoals = goals.filter(goal => !(goal.userUuid === userUuid));

        if (updatedGoals.length === goals.length) {
            return false;
        }

        try {
            await fsPromises.writeFile(p, JSON.stringify(updatedGoals, null, 2));
            return true;
        } catch (err) {
            console.error(`Error deleting goals for userUuid ${userUuid}`, err);
            throw err;
        }
    }

    // INSTANCE METHOD
    async save() {
        try {
            const goals = await getGoalsFromFile();
            goals.push(this);
            await fsPromises.writeFile(p, JSON.stringify(goals, null, 2));
        } catch (err) {
            console.error(`Failed to save goal with ID ${this.goalId}:`, err);
        }
    }
};