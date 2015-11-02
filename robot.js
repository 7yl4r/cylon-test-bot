"use strict";

// set up database
var Datastore = require('nedb');
var db = new Datastore();

var SENSOR_NAME = 'test-sensor';


// set up robot 
var Cylon = require("cylon");

Cylon.api();

Cylon.robot({
    name: "cylon-test-bot",

    connections: {
        loopback: { adaptor: "loopback" }
    },

    devices: {
        ping: { driver: "ping" }
    },

    work: function(my) {
        every((1).seconds(), function() {
            console.log(my.ping.ping());

            var doc = { 
                sensor: SENSOR_NAME,
                val: Math.round(Math.random()*10),
                t: new Date()
            };

            db.insert(doc, function (err, newDoc) {   // Callback is optional
              // newDoc is the newly inserted document, including its _id
                console.log('added sensor val: ', newDoc.val); 
            });

        });

        after((5).seconds(), function() {
            console.log("I've been at your command for 5 seconds now.");
            console.log("collected data:");
            db.find({ sensor: SENSOR_NAME }, function (err, docs) {
                console.log(docs);
            });
        });
    }
});

Cylon.start();
console.log("Hello, human!");
