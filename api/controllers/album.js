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
        const albumesObtenidos = await albumes.find({}).sort('title');
        return res.send(albumesObtenidos && albumesObtenidos.length ? albumesObtenidos : []);
      } catch (error) {
        return res.status(400).send({
          status: 'failure'
        });
      }
    /*
    try {
        if(!artistId){
            const albumesObtenidos = await albumes.find({}).sort('title');
            return res.send(albumesObtenidos && albumesObtenidos.length ? albumesObtenidos : []);
        }else{
            const albumes = await albumes.find({artist: artistId}).sort('year');
            return res.send(albumes && albumes.length ? albumes : []);
        }
        
    } catch (error) {
        return res.status(400).send({
            status: 'failure'
        });
    }*/
}

async function getAlbum(req, res){
    
    console.log("22");
    try{
        const album = await albumes.findByOne({'_id':req.params.id}).populate({path: 'artist'});
        return res.send(album ? album : {});
        /*
        await albumes.findById(albumId).populate({path: 'artist'}).exec((err, album)=>{
            if(err){
                return res.status(404).send("Error");    
            }else{
                if(!album){
                    return res.status(404).send("El album no existe");    
                }else{
                    return res.status(200).send({ album });
                }
            }
        });*/
        
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

module.exports = { saveAlbum, findAll, getAlbum, updateAlbum, deleteAlbum };
