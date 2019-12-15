const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vote = require('../models/Vote');
const Pusher = require('pusher');
const axios = require('axios');
const keys = require('../config/keys');

var pusher = new Pusher({
  appId: keys.pusherAppId,
  key: keys.pusherKey,
  secret: keys.pusherSecret,
  cluster: keys.pusherCluster,
  encrypted: keys.pusherEncrypted
});

router.get('/', (req, res) => {
  Vote.find().then(votes => res.json({ success: true, votes: votes }));
});

router.post('/', (req, res) => {
  axios.get('http://payments-uat.nxn.com.pk/publish_mw_api/api/dashboard/get_dashboard_summary').then(response => {

    const [{ model_name, model_sold }] = response.data;
    console.log(model_name);
    console.log(model_sold);
    const newVote = {
      // os: req.body.os,
      // points: 1
      os: model_name,
      points: model_sold
    };

    new Vote(newVote).save().then(vote => {
      pusher.trigger('os-poll', 'os-vote', {
        points: parseInt(vote.points),
        os: vote.os
      });
      return res.json({ success: true, message: 'Thank you for voting' });
    });
  }).catch(err => res.status(404).json(err));;
})



module.exports = router;