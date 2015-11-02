"use strict";

// set up database
var Datastore = require('nedb');

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

    db: new Datastore(),
    DATA_LOG_MAX_LEN: 10,
    SENSOR_NAME: 'test-sensor',

    work: function(my) {
        every((1).seconds(), function() {
            console.log(my.ping.ping());

            var doc = { 
                sensor: my.SENSOR_NAME,
                val: Math.round(Math.random()*10),
                t: new Date()
            };

            my.db.insert(doc, function (err, newDoc) {   // Callback is optional
              // newDoc is the newly inserted document, including its _id
                console.log('add sensor val: ', newDoc.val); 

                // check # of documents existing
                my.db.count({ sensor: my.SENSOR_NAME }, function (err, count) {
                    // if too many
                    if ( count > my.DATA_LOG_MAX_LEN ) {
                        // remove oldest
                        my.db.find({sensor: my.SENSOR_NAME}).sort({t: 1}).exec(function(err, docs){
                            var d = docs[0];
                            var oldId = d._id;
                            console.log('data log limit. purging ' + d.val + ' from ' + d.t);
                            my.db.remove({_id: oldId}, {}, function (err, numRemoved) {
                                console.log(numRemoved + ' removed. ' + err);
                            });
                        });
                        
                    }
                });
            });

        });

        every((5).seconds(), function() {
            console.log("collected data:");
            my.db.find({ sensor: my.SENSOR_NAME }, function (err, docs) {
                console.log(docs);
            });
        });
    }
});

Cylon.start();
console.log("Hello, human!");
