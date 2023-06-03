'use strict'

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

const uri = "mongodb+srv://ignaciosanchez9:M1k4tus12023@clusterwurmify.xyd8h0c.mongodb.net/?retryWrites=true&w=majority";


let connectWithRetry= function() {
    mongoose.Promise = global.Promise;
    return mongoose.connect(uri, options).then(() => { 
        app.listen(port, function(){
          console.log("Está funcionando");
        })
      },
      err => { console.log("error.....") }
    );
  };

  connectWithRetry();