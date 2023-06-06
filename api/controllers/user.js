'use strict'
const bcrypt = require('bcrypt');
var User = require('../models/user')
const mongoose = require('mongoose');
const usuarios = mongoose.model('User');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: 'AKIAU727EPNRDMRYWXPS',
  secretAccessKey: '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'
});
const s3 = new AWS.S3();

async function pruebas(req, res) {
  res.status(200).send({ message: "Controlador OK" });
}

async function saveUser(req, res) {
  var user = new User();
  var params = req.body;

  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = 'ROLE_USER';
  user.image = 'null';

  if (params.password) {
    var hash = bcrypt.hashSync(params.password, 10);
    user.password = hash;
    if (user.name != null && user.surname != null && user.email != null) {
      //save

      try {
        const result = await usuarios.findOne({ 'email': user.email });
        console.log(result);
        if(!result){
          try {
            await new usuarios(user).save();
            console.log("good");
            return res.send({
              status: user
            });
          } catch (error) {
            return res.send({
              status: "errorrrr"
            })
          }
        }
        
      } catch (error) {
        return res.status(400).send({
          status: 'failure' + error
        });
      }
    } else {
      res.status(200).send({ message: 'Rellene todos los campos' });
    }

  } else {
    res.status(200).send({ message: 'Introduzca pass' });
  }

}

async function findAll(req, res) {
  try {
    const users = await usuarios.find({});
    return res.send(users && users.length ? users : []);
  } catch (error) {
    return res.status(400).send({
      status: 'failure'
    });
  }
}

async function updateUser(req, res) {
  var userId = req.params.id;
  var update = req.body;

  console.log(userId);
  console.log(req.user.sub);
  try {
    const user = await usuarios.findByIdAndUpdate(userId, update);
    return res.send({
      user: user
    });
  } catch (error) {
    return res.status(400).send({
      status: 'No se ha podido modificar'
    });
  }
}

async function uploadImage(req, res) {
  var userId = req.params.id;
  var fileName = 'No subido';

  if (req.files) {
    var filePath = req.files.image.path;
    var fileSplit = filePath.split('\\');
    var fileName = fileSplit[2];
    var extSplit = fileName.split('\.');
    var fileExtension = extSplit[1];

    if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'gif') {
      try {
        const user = await usuarios.findByIdAndUpdate(userId, { image: fileName });
        const fileContent = fs.readFileSync(filePath);
        const params = {
          Bucket: 'wurmify',
          Key: fileName,
          Body: fileContent
        }
        s3.upload(params, (err, data) => {
          if (err) {
            console.log("fail");
          } else {
            console.log(data);
          }

        })
        return res.send({
          image: fileName,
          user: user
        });
      } catch (error) {
        return res.status(400).send({
          status: 'No se ha podido modificar la imagen'
        });
      }
    } else {
      res.status(200).send({ message: 'Extensión inválida' });
    }

  } else {
    res.status(200).send({ message: 'No ha subido imagen' });
  }
}

async function getImageFile(req, res) {
  var imageFile = req.params.imageFile;
  var pathFile = './uploads/users/' + imageFile;
  let exists = fs.existsSync(pathFile);
  console.log(exists);
  if (exists) {
    res.sendFile(path.resolve(pathFile));
  } else {
    res.status(200).send({ message: 'No tiene imagen' });
  }
}

async function loginUser(req, res) {
  try {
    const usuario = req.body;
    const usuarioLeido = await usuarios.findOne({ 'email': usuario.email });
    if (usuarioLeido) {
      console.log("usuario:");
      console.log(usuarioLeido);
      if (!isValidPassword(usuarioLeido, usuario.password)) {
        console.log('Invalid Password');
      } else {
        // SI gethash ES TRUE, GENERA UN TOKEN JWT
        if (req.body.gethash) {
          console.log("ole");
          console.log(usuario.password);
          return res.status(200).send({
            token: jwt.createToken(usuario)
          })
        } else {
          return res.send({ usuarioLeido });
        }
      }
    } else {
      return res.send({ status: 'not found' });
    }
  } catch (error) {
    return res.status(400).send({
      status: 'failure'
    });
  }
}

function isValidPassword(user, password) {
  var result = bcrypt.compareSync(password, user.password);
  if (result) {
    console.log("Password correct");
  } else {
    console.log("Password wrong");
  }
  return result;
}

module.exports = { pruebas, saveUser, findAll, loginUser, updateUser, uploadImage, getImageFile };
