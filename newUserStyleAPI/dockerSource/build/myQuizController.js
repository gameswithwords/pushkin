"use strict";

var pushkin = require('pushkin-api');

var db_read_queue = 'test_quiz_dbread'; // simple endpoints

var db_write_queue = 'test_quiz_dbwrite'; // simple save endpoints (durable/persistent)

var task_queue = 'test_quiz_taskworker'; // for stuff that might need preprocessing

var myController = new pushkin.ControllerBuilder();
myController.setDefaultPasses(db_read_queue, db_write_queue, task_queue);
myController.setDirectUse('/health', function (req, res, next) {
  // eslint-disable-line
  res.send('obese');
}, 'get');
module.exports = myController;