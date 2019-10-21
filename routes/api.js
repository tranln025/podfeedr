const express = require('express');
const router = express.Router();
const ctlr = require('../controllers');

// NOTE Current path = /api/v1

// --------------------------------------------- AUTH --------------------------------------------- //

router.post('/signup', ctlr.auth.createUser);
router.post('/login', ctlr.auth.createSession);
router.delete('/logout', ctlr.auth.deleteSession);
router.get('/verify', ctlr.auth.verifyAuth);

// ------------------------------------------- FEED ------------------------------------------- //

// router.get('/feed/:userId', ctlr.auth.showFeed);


module.exports = router;