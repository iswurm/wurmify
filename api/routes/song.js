'use strict'

var express = require('express');
var SongController = require('../controllers/song');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/songs'});

//AÑADIR AUTENTICACIÓN POR TOKEN
router.get('/songs/:album', md_auth.ensureAuth, SongController.findAll);
router.get('/songs', md_auth.ensureAuth, SongController.findAll);
router.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
router.post('/song', md_auth.ensureAuth, SongController.saveSong);
router.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong);
router.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
router.post('/upload-song-file/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
router.get('/get-song-file/:songFile', SongController.getSongFile);

module.exports = router;
