'use strict'
const bcrypt = require('bcrypt');
var User = require('../models/user')
const mongoose = require('mongoose');
const usuarios = mongoose.model('User');

async function pruebas(req, res){
    res.status(200).send({message: "Controlador OK"});
}

async function saveUser(req, res){
    var user = new User();
    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';
    
    if(params.password){
        var hash =  bcrypt.hashSync(params.password, 10);
        user.password = hash;
            if(user.name != null && user.surname != null && user.email != null){
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
            }else{
                res.status(200).send({message: 'Rellene todos los campos'});
            }
        
    }else{
        res.status(200).send({message: 'Introduzca pass'});
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

module.exports = {pruebas, saveUser, findAll};
