"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pushkinApi = _interopRequireDefault(require("pushkin-api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var myController = new _pushkinApi.default.ControllerBuilder();
myController.setPass('/getAllStimuli', 'getAllStimuli', 'queue1');
myController.setPass('/doSomething2', 'crazyMethod', 'queue2');
myController.setPass('/endExperiment', 'finish', 'queue1');
myController.setDirectUse('/health', function (req, res, next) {
  res.send('obese');
}, 'get');
var _default = myController;
exports.default = _default;