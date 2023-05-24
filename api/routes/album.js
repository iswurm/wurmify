'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/albums'});

//router.get('/albums', AlbumController.findAll);
router.get('/albums/:artist', md_auth.ensureAuth, AlbumController.getAlbums);
router.get('/albums', md_auth.ensureAuth, AlbumController.getAlbums);
router.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
router.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
router.put('/update-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
router.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
router.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
router.get('/get-image-album/:imageFile', AlbumController.getImageFile);
router.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);

module.exports = router;
