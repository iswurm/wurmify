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
    var artistId = req.params.artist;

    try {
        if(!artistId){
            const albumes = await Album.find({}).sort('title');
            return res.send(albumes && albumes.length ? albumes : []);
        }else{
            const albumes = await Album.find({artist: artistId}).sort('year');
            return res.send(albumes && albumes.length ? albumes : []);
        }

        
    } catch (error) {
        return res.status(400).send({
            status: 'failure'
        });
    }
}

async function getAlbum(req, res){
    var albumId = req.params.id;
    try{
        const album = await Album.findById({albumId}).populate({path: 'artist'}).exec((err, albums)=>{
            if(err){
                return res.status(404).send("Error");    
            }else{
                if(!albums){
                    return res.status(404).send("El album no existe");    
                }else{
                    return res.status(200).send({ albums });
                }
            }
        });
        
    }catch(error){
        return res.status(400).send({
            status: 'failure en getAlbum'
        });
    }
}

async function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;
  
    try {
      const album = await Album.findByIdAndUpdate(albumId, update);
      return res.send({
        album: album
      })
    } catch (error) {
      return res.status(400).send({
        status: 'No se ha podido modificar'
      });
    }
}

//REVISAR TODOS LOS METODOS E IMPLEMENTAR METODOS PARA LAS IMAGENES DE LOS ALBUMES (CLASE 38)

async function deleteAlbum(req, res){
    var albumId = req.params.id;
    try{
        await Album.findOneAndRemove({albumId});
        //return res.status(200).send("Borrado de album con éxito");    
    }catch(error){
        return res.status(400).send({
            status: 'failure en removeAlbum'
        });
    }
}

module.exports = { pruebas, saveAlbum, findAll, getAlbum, updateAlbum, deleteAlbum };
