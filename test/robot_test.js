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

  it("should have work", function() {
    expect(robot.work).to.be.a('function');
  });

  it("should have data after a few seconds", function() {
    clock.tick(10000);
    var db = robot.db;
    db.count({ sensor: SENSOR_NAME }, function (err, count) {
      expect(count).to.be.above(0);
    });
  });

  it("should not have above log size limit after long time", function() {
    clock.tick(30000);
    var db = robot.db;
    db.count({ sensor: robot.SENSOR_NAME }, function (err, count) {
      expect(count).to.be.below(robot.DATA_LOG_MAX_LEN);
    });
  });
});
