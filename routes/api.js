const express = require('express');
const router = express.Router();
const ctlr = require('../controllers');
const db = require('../models');

// NOTE Current path = /api/v1

// --------------------------------------------- AUTH --------------------------------------------- //

router.post('/signup', ctlr.auth.createUser);
// router.get('/signup', ctlr.auth.viewAllUsers);
// router.delete('/signup', ctlr.auth.deleteAllUsers);
router.post('/signin', ctlr.auth.createSession);
router.delete('/signout', ctlr.auth.deleteSession);

// ------------------------------------------- PODCASTS ------------------------------------------- //
// podcasts
router.get('/podcasts', ctlr.podcast.showAll);
// router.delete('/podcasts', ctlr.podcast.deleteAll);
router.post('/podcasts/:id', ctlr.podcast.createOrUpdate);

// user's podcasts
router.get('/podcasts/:userId', ctlr.podcast.showUserPodcasts);
router.put('/podcasts/:userId', ctlr.podcast.removeFromUser);

// users/:userId/podcasts/:podcastId

module.exports = router;
