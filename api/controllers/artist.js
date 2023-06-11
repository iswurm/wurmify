'use strict'

require('dotenv').config();
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

const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();

async function saveArtist(req, res) {
  var artist = new Artist();
  var params = req.body;

  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';

  if (artist.name != null && artist.description != null) {
    //save
    try {
      const result = await artistas.findOne({ 'name': artist.name });
      if (!result) {
        try {
          await new artistas(artist).save();
          return res.send({
            status: artist
          });
        } catch (error) {
          return res.send({
            status: "errorrrr"
          })
        }
      } else {
        return res.send({
          status: "errorrrr"
        })
      }
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
    return res.status(200).send({
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
  if (req.files.image) {
    var filePath = req.files.image.path;
    var fileSplit = filePath.split('\\');
    var fileName = fileSplit[2];
    var extSplit = fileName.split('\.');
    var fileExtension = extSplit[1];

    if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'gif') {
      try {
        const artist = await artistas.findByIdAndUpdate(artistId, { image: fileName });
        const fileContent = fs.readFileSync(filePath);
        const params = {
          Bucket: 'wurmify',
          Key: fileName,
          Body: fileContent
        }
        s3.upload(params, (err, data) => {
          if (err) {
            return res.status(400).send({
              status: 'No se ha podido subir la imagen'
            });
          } else {
            return res.status(200).send({
              status: data.Location
            });
          }
        })
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
  if (exists) {
    res.sendFile(path.resolve(pathFile));
  } else {
    res.status(200).send({ message: 'No tiene imagen' });
  }
}

async function deleteArtist(req, res) {
  var artistId = req.params.id;
  try {
    await artistas.findOneAndRemove({ _id: artistId });
    await albumes.deleteMany({ artist: artistId });
    await canciones.deleteMany({ album: artistId });
    //await Song.findOneAndRemove(songId, (err, songRemoved) => {...});
    //return res.status(200).send("Borrado de album con éxito");    
  } catch (error) {
    return res.status(400).send({
      status: 'failure en removeAlbum'
    });
  }
}



module.exports = { saveArtist, findAll, getArtist, getArtistPaginado, updateArtist, uploadImage, getImageFile, deleteArtist };
