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
    res.json({
      status: 200,
      count: allPodcasts.length,
      data: allPodcasts,
      requestedAt: new Date().toLocaleString()
    });
  });
});

// router.post('/podcasts', (req, res) => {
//   db.Podcast.create(req.body, (err, newPodcast) => {
//     if (err) return console.log(err)

//     res.json({
//       status: 201,
//       data: newPodcast,
//     });
//   });
// });

// routes for testing
// router.get('/podcasts/:name', (req, res) => {
//   let name = req.params.name;
//   db.Podcast.find({ name: {$regex: `${name}`, $options: 'i'} }, (err, foundPodcast) => {
//     if (err) return console.log(err);
//     res.json({
//       status: 200,
//       data: foundPodcast,
//     });
//   });
// });

router.post('/podcasts/:id', (req, res) => {
  db.Podcast.find({itunesLink: req.body.itunesLink}, (err, existingPodcast) => {
    if (err) return console.log(err);
    if (!existingPodcast.length) {
      db.Podcast.create(req.body, (err, newPodcast) => {
        if (err) return console.log(err);

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
      db.User.findById(req.params.id, (err, foundUser) => {
        if (err) return console.log(err);

        console.log(existingPodcast);
        foundUser.podcasts.push(existingPodcast[0]._id);
        console.log(foundUser.podcasts);
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
      })
  });

router.put('/podcasts/:userId', (req, res) => {
  db.User.findById(req.params.userId)
    .populate('podcasts')
    .exec((err, foundUser) =>  {
      console.log('founduser', foundUser)
      if (err) return console.log('error finding user', err);
      const index = foundUser.podcasts.findIndex(x => x.itunesLink === req.body.itunesLink)
      console.log('index', index);
      foundUser.podcasts.splice(index,1);
      console.log('UPDATED PODCASTS -->', foundUser.podcasts);
      foundUser.save((err, updatedUser) => {
        if (err) return console.log(err);
        res.sendStatus(200);
      });
    })
});

// ------------------------------------------- FEED ------------------------------------------- //

// router.get('/feed/:userId', ctlr.auth.showFeed);


module.exports = router;