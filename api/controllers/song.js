'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var Album = require('../models/album');
var Song = require('../models/song');
const mongoose = require('mongoose');
const song = require('../models/song');
const artistas = mongoose.model('Artist');
const albumes = mongoose.model('Album');
const songs = mongoose.model('Song');

async function pruebas(req, res) {
    res.status(200).send({ message: "Controlador OK" });
}

async function saveSong(req, res) {
    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    if (song.name != null && song.duration != null && song.album) {
        //save
        try {
            await new songs(song).save();
            return res.send({
                status: song
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
    var albumId = req.params.album;

    try {
        if(!albumId){
            const songs = await Song.find({}).sort('title');
            //return res.send(songs && songs.length ? songs : []);
        }else{
            const songs = await Song.find({album: albumId}).sort('number');
            //return res.send(songs && songs.length ? songs : []);
        }

        songs.populate({
            path: 'album',
            populate: {
                path: 'artist',
                model: 'Artist'
            }
        }).exec(function(err, songs){
            if(err){
                res.status(500).send({message: "Error en la petición"});
            }else{
                if(!songs){
                    res.status(404).send({message: "No existen las canciones"});
                }else{
                    res.status(200).send({songs});
                }
            }
        })
    } catch (error) {
        return res.status(400).send({
            status: 'failure'
        });
    }
}

async function getSong(req, res){
    var songId = req.params.id;
    try{
        await Song.findById({songId}).populate({path: 'album'}).exec((err, song)=>{
            if(err){
                return res.status(500).send("Error");    
            }else{
                if(!song){
                    return res.status(404).send("La canción no existe");    
                }else{
                    return res.status(200).send({ song });
                }
            }
        });
        
    }catch(error){
        return res.status(400).send({
            status: 'failure en getAlbum'
        });
    }
}

async function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;
  
    try {
        //Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {...}); SEGUIR PROBANDO CON ESTO
        await Song.findByIdAndUpdate(songId, update);
    } catch (error) {
      return res.status(400).send({
        status: 'No se ha podido modificar'
      });
    }
}

async function deleteSong(req, res){
    var songId = req.params.id;
    try{
        await Song.findOneAndRemove({songId});
        //await Song.findOneAndRemove(songId, (err, songRemoved) => {...});
        //return res.status(200).send("Borrado de album con éxito");    
    }catch(error){
        return res.status(400).send({
            status: 'failure en removeAlbum'
        });
    }
}

async function getSongFile(req, res){
    var songFile = req.params.songFile;
    var pathFile = './uploads/songs/'+songFile;
    let exists = fs.existsSync(pathFile);
    if (exists) {
        res.sendFile(path.resolve(pathFile));
      } else {
        res.status(200).send({ message: 'No tiene imagen' });
      }
}

async function uploadFile(req, res){
    var songId = req.params.id;
    var fileName = 'No subido';
  
    if (req.files) {
      var filePath = req.files.image.path;
      var fileSplit = filePath.split('\\');
      var fileName = fileSplit[2];
      var extSplit = fileName.split('\.');
      var fileExtension = extSplit[1];
  
      if (fileExtension == 'mp3' || fileExtension == 'ogg') {
        try {
          const song = await songs.findByIdAndUpdate(songId, { file: fileName });
          return res.send({
            file: fileName,
            song: song
          });
        } catch (error) {
          return res.status(400).send({
            status: 'No se ha podido modificar la canción'
          });
        }
      } else {
        res.status(200).send({ message: 'Extensión inválida' });
      }
  
    } else {
      res.status(200).send({ message: 'No ha subido imagen' });
    }
}

module.exports = { pruebas, saveSong, findAll, getSong, updateSong, deleteSong, uploadFile, getSongFile };
