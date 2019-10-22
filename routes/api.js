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
router.get('/podcasts/:name', (req, res) => {
  let name = req.params.name;
  db.Podcast.find({ name: {$regex: `${name}`, $options: 'i'} }, (err, foundPodcast) => {
    if (err) return console.log(err);
    res.json({
      status: 200,
      data: foundPodcast,
    });
  });
});

router.post('/podcasts/:id', (req, res) => {
    db.Podcast.create(req.body, (err, newPodcast) => {
        if (err) return console.log(err);
    
        res.json({
          status: 201,
          data: newPodcast,
        });

        db.User.findById(req.params.id, (err, foundUser) => {
            if (err) return console.log(err);
    
            foundUser.podcasts.push(newPodcast); 
            foundUser.save((err, updatedUser) => {
                if (err) return console.log(err);
                console.log(updatedUser);
            })
            
            // res.json({
            //     status: 200,
            //     data: foundUser,
            //     requestedAt: new Date().toLocaleString()
            // });
        });
    });
});

router.get('/podcasts/:id', (req, res) => {
    let id = req.params.id;
    db.User.findById(id).populate('podcasts')
    .exec((err, foundUser) => {
        if (err) return console.log(err);
        res.json({
          status: 200,
          data: foundUser.podcasts,
        });
      })
  });
  

router.delete('/podcasts/:id', (req, res) => {
  db.Podcast.findByIdAndDelete(req.params.id, (err, foundPodcast) => {
    if (err) return console.log(err);
    res.json({
      status: 200,
      data: foundPodcast,
    });
  })
});


// ------------------------------------------- FEED ------------------------------------------- //

// router.get('/feed/:userId', ctlr.auth.showFeed);


module.exports = router;