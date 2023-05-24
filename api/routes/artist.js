'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/artists'});

router.get('/artists', ArtistController.findAll);
router.get('/artist/:id', ArtistController.getArtist);
router.get('/artists/:page', ArtistController.getArtistPaginado);
router.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
router.put('/update-artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
router.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
router.get('/get-image-artist/:imageFile', ArtistController.getImageFile);
router.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);

module.exports = router;
