'use strict'

async function pruebas(req, res){
    res.status(200).send({message: "Controlador OK"});
}

module.exports = {pruebas};