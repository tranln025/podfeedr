const db = require('../models');

// READ show all podcasts
const showAll = (req, res) => {
  db.Podcast.find({}, (err, allPodcasts) => {
    if (err) return console.log(err)
    res.json({
      status: 200,
      count: allPodcasts.length,
      data: allPodcasts
    });
  });
};

// check if a podcast exists
// if so, UPDATE its heart count
// if not, CREATE it
const createOrUpdate = (req, res) => {
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
    };
  });
};

// FOR TESTING: DELETE all podcasts
const deleteAll = (req, res) => {
  db.Podcast.deleteMany({}, (err, deletedPodcasts) => {
    if (err) return console.log(err);
    res.json({
      status: 200,
    });
  });
};

// READ all podcasts for a user
const showUserPodcasts = (req, res) => {
  let id = req.params.userId;
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
};

// UPDATE user's podcast list and heart count
const removeFromUser = (req, res) => {
  db.User.findById(req.params.userId)
    .populate('podcasts')
    .exec((err, foundUser) =>  {
      if (err) return console.log('error finding user', err);
      const index = foundUser.podcasts.findIndex(x => x.itunesLink === req.body.itunesLink)
      foundUser.podcasts.splice(index, 1);
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
};

module.exports = {
  showAll,
  createOrUpdate,
  deleteAll,
  showUserPodcasts,
  removeFromUser,
};
