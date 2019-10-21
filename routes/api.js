const express = require('express');
const router = express.Router();
const ctlr = require('../controllers');

const db = require('../models');

// NOTE Current path = /api/v1

// --------------------------------------------- AUTH --------------------------------------------- //

router.post('/signup', ctlr.auth.createUser);
router.get('/signup', ctlr.auth.viewAllUsers)
router.post('/signin', ctlr.auth.createSession);
router.delete('/logout', ctlr.auth.deleteSession);

// ------------------------------------------- VIEW THE API ------------------------------------------- //

router.get('/podcasts', (req, res) => {
  db.Podcast.find({}, (err, allPodcasts) => {
    if (err) return console.log(err)
    res.json(allPodcasts);
  });
});

router.post('/podcasts', (req, res) => {
  db.Podcast.create(req.body, (err, newPodcast) => {
    if (err) return console.log(err)
    res.json({
      status: 201,
      data: newPodcast,
    });
  });
});
// ------------------------------------------- FEED ------------------------------------------- //

// router.get('/feed/:userId', ctlr.auth.showFeed);


module.exports = router;