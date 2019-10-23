const express = require('express');
const router = express.Router();
const ctlr = require('../controllers');

const db = require('../models');

// NOTE Current path = /api/v1

// --------------------------------------------- AUTH --------------------------------------------- //

router.post('/signup', ctlr.auth.createUser);
router.get('/signup', ctlr.auth.viewAllUsers)
router.delete('/signup', ctlr.auth.deleteAllUsers)
router.post('/signin', ctlr.auth.createSession);
router.delete('/signout', ctlr.auth.deleteSession);

// ------------------------------------------- VIEW THE API ------------------------------------------- //

router.get('/podcasts', (req, res) => {
  db.Podcast.find({}, (err, allPodcasts) => {
    if (err) return console.log(err)
    res.json(allPodcasts);
  });
});

router.post('/podcasts/:id', (req, res) => {
  db.Podcast.findOne({itunesLink: req.body.itunesLink}, (err, existingPodcast) => {
    if (err) return console.log(err);
    if (!existingPodcast) {
      db.Podcast.create(req.body, (err, newPodcast) => {
        if (err) return console.log(err);

        newPodcast.heartCount = 1;
        newPodcast.save((err, saved) => {
          if (err) return console.log(err);
        });

        db.User.findById(req.params.id, (err, foundUser) => {
          if (err) return console.log(err);
          foundUser.podcasts.push(newPodcast);
          foundUser.save((err, updatedUser) => {
              if (err) return console.log(err);
              res.json({
                status: 201,
                data: newPodcast,
              });
          });
        });
      });
    } else {
      existingPodcast.heartCount += 1;
      existingPodcast.save((err, updated) => {
        if (err) return console.log(err);
      });

      db.User.findById(req.params.id, (err, foundUser) => {
        if (err) return console.log(err);

        foundUser.podcasts.push(existingPodcast._id);
        foundUser.save((err, updatedUser) => {
            if (err) return console.log(err);
            res.json({
              status: 201,
              data: existingPodcast,
            });
        });
      });
    }
  })
});

router.get('/podcasts/:id', (req, res) => {
    let id = req.params.id;
    db.User.findById(id)
    .populate('podcasts')
    .exec((err, foundUser) => {
        if (err) return console.log(err);
        res.json({
          status: 200,
          count: foundUser.podcasts.length,
          data: foundUser.podcasts,
        });
      });
  });

router.put('/podcasts/:userId', (req, res) => {
  db.User.findById(req.params.userId)
    .populate('podcasts')
    .exec((err, foundUser) =>  {
      if (err) return console.log('error finding user', err);
      const index = foundUser.podcasts.findIndex(x => x.itunesLink === req.body.itunesLink)
      foundUser.podcasts.splice(index,1);
      foundUser.save((err, updatedUser) => {
        if (err) return console.log(err);
        res.sendStatus(200);
      });
      db.Podcast.findOne({name: req.body.name}, (err, foundPodcast) => {
        console.log(foundPodcast);
        foundPodcast.heartCount --;
        foundPodcast.save((err, updated) => {
          if (err) return console.log(err);
        });
      });
    });
});

module.exports = router;