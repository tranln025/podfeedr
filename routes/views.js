const express = require('express');
const router = express.Router();
const ctlr = require('./../controllers');

// ---------------------------------------------------- AUTH

// GET Home
router.get('/', (req, res) => {
    res.sendFile('views/index.html', {
        root: `${__dirname}/../`
    });
});


// GET Login
router.get('/login', (req, res) => {
    res.sendFile('views/auth/login.html', {
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