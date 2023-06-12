'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users'});

router.post('/register', UserController.saveUser);
router.get('/usuarios', md_auth.ensureAuth, UserController.findAll);
router.post('/login', UserController.loginUser);
router.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
router.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
router.get('/get-image-user/:imageFile', UserController.getImageFile)

module.exports = router;
