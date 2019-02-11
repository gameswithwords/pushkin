"use strict";

var _index = _interopRequireDefault(require("../../../pushkin-api/build/index.js"));

var _myQuizController = _interopRequireDefault(require("./myQuizController.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = new _index.default.API(process.env.PORT, process.env.AMQP_ADDRESS);
api.init().then(function () {
  api.usePushkinController('/api/myQuiz', _myQuizController.default);
  api.start();
}).catch(function (err) {
  console.log(err);
});