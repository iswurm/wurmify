'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');


//EN POSTMAN --> HEADERS: Authorization: [meter el token jwt]
router.get('/controlador', md_auth.ensureAuth, UserController.pruebas);
router.post('/register', UserController.saveUser);
router.get('/usuarios', md_auth.ensureAuth, UserController.findAll);
router.post('/login', UserController.loginUser);
//continuar con lecciones 22, 23, 24.
router.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);

module.exports = router;
