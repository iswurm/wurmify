'use strict'

var express = require('express');
var SongController = require('../controllers/song');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

//AÑADIR AUTENTICACIÓN POR TOKEN
router.get('/songs/:album', SongController.findAll);
router.get('/song/:id', SongController.getSong);
router.post('/song', SongController.saveSong);
router.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong);
router.delete('/song/:id', SongController.deleteSong);

module.exports = router;
