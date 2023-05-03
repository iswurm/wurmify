'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');

var router = express.Router();

router.get('/artists', ArtistController.findAll);

module.exports = router;
