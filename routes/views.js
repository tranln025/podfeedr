const express = require('express');
const router = express.Router();
const ctlr = require('./../controllers');

// ---------------------------------------------------- AUTH

// GET Home
router.get('/signup', (req, res) => {
    res.sendFile('views/auth/signup.html', {
        root: `${__dirname}/../`
    });
});

// GET Sign In
router.get('/signin', (req, res) => {
    res.sendFile('views/auth/signin.html', {
        root: `${__dirname}/../`
    });
});

// GET Search
router.get('/search', (req, res) => {
    res.sendFile('views/search.html', {
        root: `${__dirname}/../`
    });
});


// ---------------------------------------------------- FEED

// GET User Feed
router.get('/feed/:userId', (req, res) => {
    if (!req.session.currentUser) {
      return res.redirect('/login');
    };

    res.sendFile('views/feed/show.html', {
      root: `${__dirname}/../`
    });
});




module.exports = router;