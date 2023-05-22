'use strict'

var express = require('express');
var SongController = require('../controllers/song');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/songs'});

//AÑADIR AUTENTICACIÓN POR TOKEN
router.get('/songs/:album', SongController.findAll);
router.get('/songs', SongController.findAll);
router.get('/song/:id', SongController.getSong);
router.post('/song', SongController.saveSong);
router.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong);
router.delete('/song/:id', SongController.deleteSong);
router.post('/upload-song-file/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
router.get('/get-song-file/:songFile', md_auth.ensureAuth, SongController.getSongFile);

module.exports = router;
