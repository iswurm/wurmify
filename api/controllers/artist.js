'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
const mongoose = require('mongoose');
const album = require('../models/album');
const artistas = mongoose.model('Artist');
const albumes = mongoose.model('Album');
const canciones = mongoose.model('Song');

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

async function getArtist(req, res) {
  var artistId = req.params.id;
  try {
    const artist = await artistas.findOne({ '_id': artistId });
    if (!artist) {
      return res.status(404).send("El artista no existe");
    } else {
      return res.status(200).send({ artist });
    }

  } catch (error) {
    return res.status(400).send({
      status: 'failure'
    });
  }
}

async function getArtistPaginado(req, res) {
  var page = req.params.page;
  var itemsPerPage = 3;
  try {
    const artists = await Artist.find().sort('name').paginate(page, itemsPerPage);
    console.log(artists);
    if (!artists) {
      return res.status(404).send("No existen artistas");
    } else {
      return res.status(200).send({
        artists: artists
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: 'failure'
    });
  }

}

async function updateArtist(req, res) {
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

async function uploadImage(req, res) {
  var artistId = req.params.id;
  var fileName = 'No subido';
  console.log(req.files);
  if (req.files) {
    var filePath = req.files.image.path;
    var fileSplit = filePath.split('\\');
    var fileName = fileSplit[2];
    var extSplit = fileName.split('\.');
    var fileExtension = extSplit[1];

    if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'gif') {
      try {
        const artist = await artistas.findByIdAndUpdate(artistId, { image: fileName });
        console.log(filePath);
        return res.send({
          image: fileName,
          artist: artist
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
  var pathFile = './uploads/artists/' + imageFile;
  let exists = fs.existsSync(pathFile);
  console.log(exists);
  if (exists) {
    res.sendFile(path.resolve(pathFile));
  } else {
    res.status(200).send({ message: 'No tiene imagen' });
  }
}

async function deleteArtist(req, res){
  var artistId = req.params.id;
  try{
      await artistas.findOneAndRemove({_id: artistId});
      await albumes.findOneAndRemove({artist: artistId});
      await canciones.findOneAndRemove({album: artistId});
      //await Song.findOneAndRemove(songId, (err, songRemoved) => {...});
      //return res.status(200).send("Borrado de album con éxito");    
  }catch(error){
      return res.status(400).send({
          status: 'failure en removeAlbum'
      });
  }
}


module.exports = { pruebas, saveArtist, findAll, getArtist, getArtistPaginado, updateArtist, uploadImage, getImageFile, deleteArtist };
