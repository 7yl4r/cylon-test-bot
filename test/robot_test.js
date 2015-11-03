"use strict";

process.env.NODE_ENV = 'test';

// setup for tests
var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

chai.use(sinonChai);

var clock = sinon.useFakeTimers;

// load the robot, in test mode
var Cylon = require('cylon');

Cylon.config({ testMode: true })

require('../robot.js');

describe("cylon-test-bot", function() {
  var robot = Cylon.robots["cylon-test-bot"];

  it("should have functionFired == false @ t<5s", function() {
    clock.tick(1000);
    expect(robot.functionFired).to.be.false;
  });

  it("should have functionFired == true @ t>5s", function() {
    clock.tick(10000);
    expect(robot.functionFired).to.be.true;
  });
 
});
