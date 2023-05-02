'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();

router.get('/controlador', UserController.pruebas);
router.post('/register', UserController.saveUser);
router.get('/usuarios', UserController.findAll);
router.post('/login', UserController.loginUser);

module.exports = router;
