"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pushkinApi = _interopRequireDefault(require("pushkin-api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db_read_queue = 'apinpmtest_quiz_dbread'; // simple endpoints

var db_write_queue = 'apinpmtest_quiz_dbwrite'; // simple save endpoints (durable/persistent)

var task_queue = 'apinpmtest_quiz_taskworker'; // for stuff that might need preprocessing

var myController = new _pushkinApi.default.ControllerBuilder();
myController.setDefaultPasses(db_read_queue, db_write_queue, task_queue);
myController.setDirectUse('/health', function (req, res, next) {
  res.send('obese');
}, 'get');
var _default = myController;
exports.default = _default;