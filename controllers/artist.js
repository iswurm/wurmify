'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
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
        const artists = await Artist.find({});
        return res.send(artists && artists.length ? artists : []);
    } catch (error) {
        return res.status(400).send({
            status: 'failure'
        });
    }
}

async function getArtist(req, res){
    var artistId = req.params.id;
    try{
        const artist = await Artist.findById({artistId});
        if(!artist){
            return res.status(404).send("El artista no existe");    
        }else{
            return res.status(200).send({artist});
        }
        
    }catch(error){
        return res.status(400).send({
            status: 'failure'
        });
    }
}

async function getArtistPaginado(req, res){
    var page = req.params.page;
    var itemsPerPage = 3;
    try{
        const artists = await Artist.find().sort('name').paginate(page, itemsPerPage);
        if(!artists){
            return res.status(404).send("No existen artistas"); 
        }else{
            return res.status(200).send({
                pages: total,
                artists: artists
            });
        }
    }catch(error){
        return res.status(400).send({
            status: 'failure'
        });
    }
    
}

async function updateArtist(req, res){
    var artistId = req.params.id;
    var update = req.body;
  
    try {
      const artist = await artistas.findByIdAndUpdate(artistId, update);
      return res.send({
        artist: artist
      });
    } catch (error) {
      return res.status(400).send({
        status: 'No se ha podido modificar'
      });
    }
  }


module.exports = { pruebas, saveArtist, findAll, getArtist, getArtistPaginado, updateArtist };
