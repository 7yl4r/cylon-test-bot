"use strict";

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
    
    functionFired: false,

    work: function(my) {
        after((5).seconds(), function() {
            functionFired = true;
        });
    }
});

Cylon.start();
