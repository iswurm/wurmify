'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

router.get('/artists', ArtistController.findAll);
router.get('/artist/:id', ArtistController.getArtist);
router.get('/artist/:page', ArtistController.getArtistPaginado);
router.post('/artist', ArtistController.saveArtist);
router.put('/update-artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);

module.exports = router;
