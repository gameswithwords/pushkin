"use strict";

var pushkin = require('pushkin-api');

var myQuizController = require('./myQuizController.js');

var api = new pushkin.API(process.env.PORT, process.env.AMQP_ADDRESS);
api.init().then(function () {
  api.usePushkinController('/api/test', myQuizController);
  api.start();
}).catch(function (err) {
  console.log(err);
});