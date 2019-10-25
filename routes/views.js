const express = require('express');
const router = express.Router();


// GET Index Page (leads to signup)
router.get('/', (req, res) => {
    res.sendFile('views/auth/signup.html', {
        root: `${__dirname}/../`
    })
});

// GET Landing Page/Signup
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


// ---------------------------------------------------- SEARCH

// GET Search
router.get('/search', (req, res) => {
    res.sendFile('views/search.html', {
        root: `${__dirname}/../`
    });
});

// GET User Feed
router.get('/feed/:userId', (req, res) => {
    if (!req.session.currentUser) {
      return res.redirect('/signin');
    };

    res.sendFile('views/feed/show.html', {
      root: `${__dirname}/../`
    });
});

module.exports = router;
