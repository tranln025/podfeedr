const bcrypt = require('bcryptjs');
const db = require('./../models');

// SECTION POST Create User
const createUser = (req, res) => {
    // console.log('create user route');
    db.User.findOne({ email: req.body.email }, (err, foundUser) => {
        if (err) return res.status(500).json({ // overwrite default status 200 by using "status"
            status: 500,
            error: [{ message: 'Something went wrong. Please try again.' }],
        });
    
        if (foundUser) return res.status(400).json({
            status: 400,
            error: [{ message: 'Invalid request. Please try again.' }],
        });

        // New salt. Takes in number of salt rounds. The higher the number, the more complex but also the longer it takes to generate salt. Convention is 10
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
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                };

                db.User.create(newUser, (err, createdUser) => {
                    if (err) return res.status(500).json({ 
                        status: 500,
                        error: [{ message: 'Something went wrong with creating the user. Please try again.' }],
                    });

                    res.status(201).json({ // only return a success status, don't return user data because hackers may try to incercept it
                        status: 201,
                    });
                });
            });
        });
    });
};


// SECTION POST Login
const createSession = (req, res) => {
    console.log('Request session object --> ', req.session)
    db.User.findOne({ email: req.body.email }, (err, foundUser) => {
        if (err) return res.status(500).json({ 
            status: 500,
            error: [{ message: 'Something went wrong with creating the session. Please try again.' }],
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


// SECTION POST Verify Auth
const verifyAuth = (req, res) => {
    if (!req.session.currentUser) {
        return res.status(401).json({
            status: 401,
            error: [{ message: 'Unauthorized. Please log in and try again.' }]
        });
    };

    res.status(200).json({
        status: 200,
        user: req.session.currentUser
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

// SECTION POST Verify Auth
const verifyAuth = (req, res) => {
    if (!req.session.currentUser) {
      return res.status(401).json({
        status: 401,
        error: [{ message: 'Unauthorized. Pleas login and try again' }],
      });
    }
  
    res.status(200).json({
      status: 200,
      user: req.session.currentUser,
    });
  }

// SECTION GET Show Feed
const showFeed = (req, res) => {
    db.User.findById(req.params.userId, (err, foundFeed) => {
      if (err) return res.status(500).json({
        status: 500,
        error: [{ message: 'Something went wrong. Please try again' }],
      });
  
      res.status(200).json({
        status: 200,
        data: foundFeed,
      });
    });
  };


module.exports = {
    createUser,
    createSession,
    deleteSession,
    verifyAuth,
    showFeed,
};