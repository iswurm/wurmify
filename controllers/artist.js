'use strict'
var Artist = require('../models/artist')
const mongoose = require('mongoose');
const artistas = mongoose.model('Artist');

async function pruebas(req, res) {
    res.status(200).send({ message: "Controlador OK" });
}

async function saveArtist(req, res) {
    var artist = new Artist();
    var params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';
    
    if (artist.name != null && artist.description != null) {
        //save
        try {
            await new artistas(artist).save();
            return res.send({
                status: artist
            });
        } catch (error) {
            return res.status(400).send({
                status: 'failure' + error
            });
        }
    } else {
        res.status(200).send({ message: 'Rellene todos los campos' });
    }

}

async function findAll(req, res) {
    try {
        const artists = await artists.find({});
        return res.send(artist && artist.length ? artist : []);
    } catch (error) {
        return res.status(400).send({
            status: 'failure'
        });
    }
}


module.exports = { pruebas, saveArtist, findAll };
