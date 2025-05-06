const fsPromises = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');
const { emit } = require('process');
const argon2 = require('argon2');

const p = path.join(__dirname, '..', 'data', 'users.json');

const getUsersFromFile = async () => {
    try {
        const fileContent = await fsPromises.readFile(p, 'utf-8');
        return JSON.parse(fileContent);
    } catch (err) {
        console.warn('Error reading users.json, returning empty array', err);
        return [];
    }
};
   
module.exports = class User {
    constructor(uuid, username, email, password, realName, avatar, createdAt, updatedAt) {
        this.uuid = uuid || randomUUID();
        this.username = username;
        this.email = email;
        this.password = password;
        this.realName = realName;
        this.avatar = avatar;
        this.createdAt = createdAt || new Date().toISOString();
        this.updatedAt = updatedAt || new Date().toISOString();
    }

    //      READ-ONLY OPERATIONS
    static async fetchAll() {
        return getUsersFromFile();
    }

    static async getUserByUUID(id) {
        const users = await getUsersFromFile();
        return users.find(u => u.uuid === id);
    }

    static async getUserByUsername(username) {
        const users = await getUsersFromFile();
        return users.find(u => u.username === username);
    }

    static async getUserByEmail(email) {
        const users = await getUsersFromFile();
        return users.find(user => user.email === email);
    }

    //      WRITE OPERATIONS
    static async addUser({ username, email, password, realName, avatar}) {
        const users = await getUsersFromFile();

        username = username.trim().toLowerCase();
        email = email.trim().toLowerCase();

        if (username && users.some(u => u.username === username)) {
            throw new Error('That username is already taken.');
        }
        if (users.some(u => u.email === email)) {
            throw new Error('That email is already registered.');
        }

        const hashedPassword = await argon2.hash(password);
        const newUser = new User(
            null,
            username,
            email,
            hashedPassword,
            realName,
            avatar
        );

        await newUser.save();
        return newUser;
    }

    static async updateUser(id, updatedFields) {
        const users = await getUsersFromFile();
        
        const userIndex = users.findIndex(u => u.uuid === id);
        if (userIndex === -1) {
            return null;
        }

        const duplicate = users.some(u => u.uuid !== id && (
            (updatedFields.username && u.username === updatedFields.username) ||
            (updatedFields.email && u.email === updatedFields.email)
        ));

        if (duplicate) {
            throw new Error('Username or email already in use by another user.');
        }

        const existingUser = users[userIndex];
        let hashedPassword = existingUser.password;

        if (updatedFields.password) {
            hashedPassword = await argon2.hash(updatedFields.password);
        }

        const updatedUser = {
            ...existingUser,
            username: updatedFields.username || existingUser.username,
            email: updatedFields.email || existingUser.email,
            password: hashedPassword,
            realName: updatedFields.realName || existingUser.realName,
            avatar: updatedFields.avatar || existingUser.avatar,
            updatedAt: new Date().toISOString()
        };

        users[userIndex] = updatedUser;

        try {
            await fsPromises.writeFile(p, JSON.stringify(users, null, 2));
            return updatedUser;
        } catch (err) {
            console.error('Write error during updateUser', err);
            throw err;
        }
    }

    static async deleteUser(id) {
        const users = await getUsersFromFile();

        const updatedUsers = users.filter(u => u.uuid !== id);

        if (updatedUsers.length === users.length) {
            return false; //no user deleted
        }

        try {
            await fsPromises.writeFile(p, JSON.stringify(updatedUsers, null, 2));
            return true;
        } catch (err) {
            console.error('Write error during deleteUser:', err);
            throw err;
        }
    }

    //      INSTANCE METHOD
    async save() {
        const users = (await getUsersFromFile()).filter(u => u.uuid !== this.uuid);
        users.push(this);

        try {
            await fsPromises.writeFile(p, JSON.stringify(users, null, 2));
        } catch (err) {
            console.error('Write error', err);
        }
    }
};



