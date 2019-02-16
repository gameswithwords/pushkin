"use strict";

var _pushkinApi = _interopRequireDefault(require("pushkin-api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = process.env.PORT || 3000;
var amqpAddress = process.env.AMQP_ADDRESS || 'amqp://localhost:5672';
var api = new _pushkinApi.default.API(port, amqpAddress);
api.init().then(api.start).catch(console.error);