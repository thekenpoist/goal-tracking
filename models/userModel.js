const fsPromises = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');
const { error } = require('console');

const p = path.join(__dirname, '..', 'data', 'users.json');


const getUsersFromFile = async () => {
    try {
        const fileContent = await fsPromises.readFile(p, 'utf-8');
        return JSON.parse(fileContent);
    } catch (err) {
        console.warn('Error reading users.json, returning empty array');
        return [];
    }
};
   
module.exports = class User {
    constructor(uuid, username, email, passwordHash, realName, avatar, createdAt, updatedAt, goals) {
        this.uuid = uuid || randomUUID();
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.realName = realName;
        this.avatar = avatar;
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = updatedAt || new Date().toISOString();
        this.goals = goals || [];
    }

    async saveUsers() {
        const users = await getUsersFromFile();
        users.push(this);
        try {
            await fsPromises.writeFile(p, JSON.stringify(users, null, 2));
        } catch (err) {
            console.error('Write error', err);
        }
    }

    static async fetchAll() {
        return getUsersFromFile();
    }

    static async getUserByID(id) {
        const users = await getUsersFromFile();
        return users.find(u => u.uuid === id);
    }

    static async getUserByUsername(username) {
        const users = await getUsersFromFile();
        return users.find(u => u.username === username);
    }

    static addUser(userData) {

    }

    static async addUser({ username, email, passwordHash, realName, avatar}) {
        const users = await getUsersFromFile();

        const usernameTaken = users.some(u => u.username === username);
        const emailTaken = users.some(u => u.email === email);

        if (usernameTaken || emailTaken) {
            throw new Error('Username or email already exists');
        }

        const newUser = new User(
            null,
            username,
            email,
            passwordHash,
            realName,
            avatar
        );

        await newUser.saveUsers();
        return newUser;
    }

};



