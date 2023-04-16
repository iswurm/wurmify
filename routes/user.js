'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();

router.get('/controlador', UserController.pruebas);

module.exports = router;
