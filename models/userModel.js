const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '..', 'data', 'users.json');

module.exports = class User {
    constructor(id, username, email, passwordHash, realName, avatar, createdAt, updatedAt, goals) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.realName = realName;
        this.avatar = avatar;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.goals = goals;
    }

};
