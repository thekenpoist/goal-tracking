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
    constructor(goalId, userId, title, category, description, priority, startDate, endDate, createdAt, updatedAt, isCompleted) {
        this.goalId = goalId;
        this.userId = userId;
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

    //      READ-ONLY OPERATIONS
    static async fetchAll() {
        return getGoalsFromFile();
    }

    static async getGoalsByUserId(userId) {
        const goals = await getGoalsFromFile();
        return goals.filter(goal => goal.userId === userId);

    }

    static async getGoalById(userId, goalId) {
        const goals = await getGoalsFromFile();
        return goals.find(goal => goal.userId === userId && goal.goalId === goalId);
    }

    //      WRITE OPERATIONS
    static async createGoal({ userId, title, category, description, priority, startDate, endDate }) {
        const goals = await getGoalsFromFile();
        let nextGoalId = 1;

        const allUserGoals = goals.filter(goal => goal.userId === userId);
        if (allUserGoals.length > 0) {
            const maxGoalId = Math.max(...allUserGoals.map(goal => goal.goalId));
            nextGoalId = maxGoalId + 1;
        }
        
        const newGoal = new Goal(
            nextGoalId,
            userId,
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

    static async updateGoal(userId, goalId, updatedFields) {
        const goals = await getGoalsFromFile();
        const goalIndex = goals.findIndex(goal => goal.userId === userId && goal.goalId === goalId);

        if (goalIndex === -1) {
            throw new Error('Goal not found');
        }

        // Destructure and ignore fields that should not be manually updated
        const { userId:_, goalId:__, createdAt:___, updatedAt:____, ...safeFields } = updatedFields;

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

    static async deleteGoal(userId, goalId) {
        const goals = await getGoalsFromFile();
        const userGoals = goals.filter(goal => goal.userId === userId);
        const updatedGoals = goals.filter(goal => !(goal.userId === userId && goal.goalId === goalId));

        if (updatedGoals.length === goals.length) {
            return false;
        }

        try {
            await fsPromises.writeFile(p, JSON.stringify(updatedGoals, null, 2));
            return true;
        } catch (err) {
            console.error(`Error deleting goalId ${goalId} for userId ${userId}`, err);
            throw err;
        }
    }

    //      INSTANCE METHOD
    async save() {
        try {
            const goals = (await getGoalsFromFile()).filter(
                goal => goal.goalId !== this.goalId && goal.userId === this.userId);
            goals.push(this);
            await fsPromises.writeFile(p, JSON.stringify(goals, null, 2));
        } catch (err) {
            console.error(`Failed to save goal with ID ${this.goalId}:`, err);
        }
    }
};