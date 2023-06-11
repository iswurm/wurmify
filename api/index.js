'use strict'
require('dotenv').config();
var mongoose = require('mongoose');
var app = require('./app.js');
var port = process.env.PORT || 3977;

const options = {
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

const uri = process.env.MONGODB_URI;

let connectWithRetry = function () {
  mongoose.Promise = global.Promise;
  return mongoose.connect(uri, options).then(() => {
    app.listen(port, function () {
      console.log("Está funcionando");
    })
  },
    err => { console.log("Error de conexión." + err) }
  );
};

connectWithRetry();