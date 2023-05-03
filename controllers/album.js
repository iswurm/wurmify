'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
const mongoose = require('mongoose');
const artistas = mongoose.model('Artist');
const albumes = mongoose.model('Album');

async function pruebas(req, res) {
    res.status(200).send({ message: "Controlador OK" });
}

async function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    if (album.title != null && album.description != null && album.artist) {
        //save
        try {
            await new albumes(album).save();
            return res.send({
                status: album
            });
        } catch (error) {
            return res.status(400).send({
                status: 'failure' + error
            });
        }
    } else {
        res.status(400).send({ message: 'Rellene todos los campos' });
    }

}

async function findAll(req, res) {
    try {
        const albumes = await Album.find({});
        return res.send(albumes && albumes.length ? albumes : []);
    } catch (error) {
        return res.status(400).send({
            status: 'failure'
        });
    }
}

async function getAlbum(req, res){
    var albumId = req.params.id;
    try{
        const album = await Album.findById({albumId});
        if(!album){
            return res.status(404).send("El artista no existe");    
        }else{
            return res.status(200).send({
                status: album
            });
        }
        
    }catch(error){
        return res.status(400).send({
            status: 'failure'
        });
    }
}

module.exports = { pruebas, saveAlbum, findAll, getAlbum };
