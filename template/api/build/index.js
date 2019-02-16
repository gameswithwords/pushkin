"use strict";

var _pushkinApi = _interopRequireDefault(require("pushkin-api"));

var _template = _interopRequireDefault(require("./controllers/template/"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = process.env.PORT || 3000;
var amqpAddress = process.env.AMQP_ADDRESS || 'amqp://localhost:5672';
var api = new _pushkinApi.default.API(port, amqpAddress);
api.init().then(function () {
  api.usePushkinController('/api/template', _template.default);
  api.start();
}).catch(console.error);