'use strict'
const bcrypt = require('bcrypt');
var User = require('../models/user')
const mongoose = require('mongoose');
const usuarios = mongoose.model('User');
var jwt = require('../services/jwt');

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
        await new usuarios(user).save();
        return res.send({
          status: user
        });
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

async function loginUser(req, res) {
  try {
    const usuario = req.body;
    const usuarioLeido = await usuarios.findOne({ 'email': usuario.email });
    if (usuarioLeido) {
      console.log(usuarioLeido);
      if (!isValidPassword(usuarioLeido, usuario.password)) {
        console.log('Invalid Password');
      } else {
        // SI gethash ES TRUE, GENERA UN TOKEN JWT
        if (params.gethash) {
          console.log(usuario.password);
          return res.status(200).send({
            token: jwt.createToken(usuario)
          })
        } else {
          return res.send({ status: 'gethash is false' });
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

module.exports = { pruebas, saveUser, findAll, loginUser };
