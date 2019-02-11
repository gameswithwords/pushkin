"use strict";

var _pushkinApi = _interopRequireDefault(require("pushkin-api"));

var _myQuizController = _interopRequireDefault(require("./myQuizController.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = new _pushkinApi.default.API(process.env.PORT, process.env.AMQP_ADDRESS);
api.init().then(function () {
  api.usePushkinController('/api/myQuiz', _myQuizController.default);
  api.start();
}).catch(function (err) {
  console.log(err);
});