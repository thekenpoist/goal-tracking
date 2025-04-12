const User = require("../models/userModel");

exports.getUserById = (req, res, next) => {
    const userId = req.params.id;
    User.getUserByID(userId, user => {
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.render('users/profile', { user });
    });
};

exports.getAddUser = (req, res, next) => {
    res.render('profiles/new-profile', {
        pageTitle: "Create Profile",
        currentPage: 'profile'
    });
};

exports.postAddUser = async (req, res, next) => {
    const { username, email, password, realName, avatar } = req.body;

    try {
        await User.addUser({
            username,
            email,
            passwordHash: password,
            realName,
            avatar
        });

        res.redirect('/profiles/${newUser.uuid)');
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).send('Failed to create user');
    }

};

exports.getUserById = async (req, res, next) => {
    const userID = req.params.userID;

    try {
        const user = await User.getUserById(userID);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('profiles/show-profile', {
            pageTitle: 'User Profile',
            user,
            currentPage: 'profile'
        });
    } catch (err) {
        console.error('Error fetching user by ID:', err);
        res.status(500).send('Server error');
    }
};