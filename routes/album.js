'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

router.get('/artists', AlbumController.findAll);
router.get('/artist/:id', AlbumController.getAlbum);
router.post('/album', AlbumController.saveAlbum);

module.exports = router;
