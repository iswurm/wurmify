'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

router.get('/artists/:artist', AlbumController.findAll);
router.get('/artist/:id', AlbumController.getAlbum);
router.post('/album', AlbumController.saveAlbum);
router.put('/update-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
router.delete('/album/:id', AlbumController.deleteAlbum);

module.exports = router;
