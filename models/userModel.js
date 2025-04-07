const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const p = path.join(__dirname, '..', 'data', 'users.json');


const getUsersFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        try {
            const users = JSON.parse(fileContent);
            cb(users);
        } catch(e) {
            console.error('Invalid JSON, returning empty array');
            cb([]);
        }
    });
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
    saveUsers() {
        getUsersFromFile(users => {
            users.push(this);
            fs.writeFile(p, JSON.stringify(users), err => {
                if (err) console.log(err);
            });
        });
    }
    static fetchAll(cb) {
        getUsersFromFile(cb);
    }

    static getUserByID(id, cb) {
        getUsersFromFile(users => {
            const user = users.find(u => u.uuid === id);
            cb(user);
        });
    }

};



