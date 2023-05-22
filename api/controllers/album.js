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
const canciones = mongoose.model('Song');


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

async function getAlbum(req, res) {
    try {
        const album = await albumes.findByOne({ '_id': req.params.id }).populate({ path: 'artist' });
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

    } catch (error) {
        return res.status(400).send({
            status: 'failure en getAlbum'
        });
    }
}

async function getAlbums(req, res) {
    try {
        var artistId = req.params.artist;
        if (!artistId) {
            const albumesObtenidos = await albumes.find({}).sort('title');
            return res.send(albumesObtenidos && albumesObtenidos.length ? albumesObtenidos : []);
        } else {
            const albumesObtenidos = await albumes.find({ artist: artistId }).populate({ path: 'artist' });
            return res.send(albumesObtenidos && albumesObtenidos.length ? albumesObtenidos : []);
        }
    } catch (error) {
        return res.status(400).send({
            status: 'failure en getAlbums'
        });
    }
}

async function updateAlbum(req, res) {
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

async function deleteAlbum(req, res) {
    var albumId = req.params.id;
    try {
        const albumBorrado = await albumes.findOneAndRemove({ albumId });
        const cancionesBorradas = await canciones.findOneAndDelete({ album: albumId });
        return res.status(200).send("BORRADO CON EXITO!");
        //return res.status(200).send("Borrado de album con éxito");    
    } catch (error) {
        return res.status(400).send({
            status: 'failure en removeAlbum'
        });
    }
}

async function uploadImage(req, res) {
    var albumId = req.params.id;
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
                const album = await albumes.findByIdAndUpdate(albumId, { image: fileName });
                console.log(filePath);
                return res.send({
                    image: fileName,
                    album: album
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
    var pathFile = './uploads/albumes/' + imageFile;
    let exists = fs.existsSync(pathFile);
    console.log(exists);
    if (exists) {
        res.sendFile(path.resolve(pathFile));
    } else {
        res.status(200).send({ message: 'No tiene imagen' });
    }
}

async function deleteAlbum(req, res){
    var albumId = req.params.id;
    try{
        await albumes.findOneAndRemove({album: albumId});
        await canciones.findOneAndRemove({album: albumId});
        //await Song.findOneAndRemove(songId, (err, songRemoved) => {...});
        //return res.status(200).send("Borrado de album con éxito");    
    }catch(error){
        return res.status(400).send({
            status: 'failure en removeAlbum'
        });
    }
}

module.exports = { saveAlbum, findAll, getAlbum, updateAlbum, deleteAlbum, getAlbums, uploadImage, getImageFile, deleteAlbum };
