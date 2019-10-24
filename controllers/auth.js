const bcrypt = require('bcryptjs');
const db = require('./../models');

// SECTION GET All Users
const viewAllUsers = (req, res) => {
    db.User.find({}, (err, allUsers) => {
        if (err) {
            return console.log(err)
        };
        res.json({
            status: 200,
            count: allUsers.length,
            data: allUsers,
            requestedAt: new Date().toLocaleString()
        })
    })
}

// SECTION POST Create User
const createUser = (req, res) => {
    // console.log('create user route');
    db.User.findOne({ email: req.body.email }, (err, foundUser) => {
        if (err) return res.status(500).json({ 
            status: 500,
            error: [{ message: 'Something went wrong. Please try again.' }],
        });
    
        if (foundUser) return res.status(400).json({
            status: 400,
            error: [{ message: 'Invalid request. Please try again.' }],
        });

        // New salt
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return res.status(500).json({ 
                status: 500,
                error: [{ message: 'Something went wrong with making the salt. Please try again.' }],
            });

            // Bcrypt takes in a password and salt
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) return res.status(500).json({ 
                    status: 500,
                    error: [{ message: 'Something went wrong with salting the hash. Please try again.' }],
                });

                const newUser = {
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    podcasts: []
                };
                console.log(newUser);

                db.User.create(newUser, (err, createdUser) => {
                    if (err) return res.status(500).json({ 
                        status: 500,
                        error: [{ message: 'Something went wrong with creating the user. Please try again.' }],
                        errorMessage: err
                    });

                    res.status(201).json({
                        status: 201,
                    });
                });
            });
        });
    });
};

// SECTION FOR TESTING: DELETE All Users
const deleteAllUsers = (req, res) => {
    db.User.deleteMany({}, (err, deletedUsers) => {
        if (err) return console.log(err);

        res.json({
            status: 200,
            count: deletedUsers.length,
            data: deletedUsers,
            requestedAt: new Date().toLocaleString()
        });
    });
};


// SECTION POST Login
const createSession = (req, res) => {
    db.User.findOne({ username: req.body.username }, (err, foundUser) => {
        if (err) return res.status(500).json({ 
            status: 500,
            error: [{ message: 'Something went wrong with creating the session. Please try again.' }],
            errorMessage: err
        });

        // If no user is found by email address, return error message
        if (!foundUser) return res.status(400).json({
            status: 400,
            error: [{ message: 'Username or password is incorrect' }]
        });

        // If user email is found, verify password
        // bcrypt.compare() takes in plaintext password, hash password, and cb function (err, isMatch) by convention
        bcrypt.compare(req.body.password, foundUser.password, (err, isMatch) => {
            if (err) return res.status(500).json({ 
                status: 500,
                error: [{ message: 'Something went wrong. Please try again.' }],
            });

            if (isMatch) {
                req.session.currentUser = foundUser._id;
                return res.status(201).json({
                    status: 201,
                    data: { id: foundUser._id }
                });
            } else {
                return res.status(400).json({
                    status: 400,
                    error: [{ message: 'Username or password is incorrect' }]
                });
            };
        });
    });
};


// SECTION DELETE Logout
const deleteSession = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({
            status: 500,
            errors: [{ message: 'Something went wrong. Please try again' }]});
  
        res.status(200).json({
            status: 200,
            message: 'Success',
        });
    });
};


module.exports = {
    viewAllUsers,
    createUser,
    createSession,
    deleteSession,
    deleteAllUsers
};

// TODO Change error messages to be vague once all troubleshooting is done