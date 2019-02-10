"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _callback_api = _interopRequireDefault(require("amqplib/callback_api"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _cookieSession = _interopRequireDefault(require("cookie-session"));

var _rpc = _interopRequireDefault(require("./rpc.js"));

var _trim = _interopRequireDefault(require("./trim.js"));

var _coreRouter = _interopRequireDefault(require("./coreRouter.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PushkinAPI =
/*#__PURE__*/
function () {
  function PushkinAPI(expressPort, amqpAddress) {
    var _this = this;

    _classCallCheck(this, PushkinAPI);

    this.expressPort = expressPort;
    this.amqpAddress = amqpAddress;
    this.app = (0, _express.default)();
    this.app.set('trust-proxy', 1);
    this.app.use((0, _cookieSession.default)({
      name: 'session',
      maxAge: 24 * 60 * 60 * 1000,
      keys: ['oursupersecrectkeyforpreventingcookietampering']
    }));
    this.app.use(function (req, res, next) {
      req.session.id = req.session.id || (0, _v.default)();
      next();
    }); // this.app.use(bodyParser.json()); // what is this?
    // this.app.use(cors()); // look this up, too

    this.expressListening = false;

    _callback_api.default.connect(this.amqpAddress, function (err, conn) {
      if (err) return console.log("Error connecting to message queue: ".concat(err));
      _this.conn = conn;
    });
  }

  _createClass(PushkinAPI, [{
    key: "passAlongMethod",
    value: function passAlongMethod(route, method, queue) {
      var _this2 = this;

      return function (req, res, next) {
        // eslint-disable-line
        console.log("".concat(route, " hit"));
        var rpcParams = {
          method: method,
          data: req.body,
          sessionId: req.session.id
        };
        (0, _rpc.default)(_this2.conn, queue, rpcParams).then(function (rpcRes) {
          try {
            console.log("".concat(route, " response: ").concat((0, _trim.default)(JSON.stringify(rpcRes), 100)));
          } catch (e) {
            console.log("".concat(route, " response (failed to JSON.stringify): ").concat((0, _trim.default)(rpcRes, 100)));
          }

          res.send({
            resData: rpcRes
          });
        }).catch(function (rpcErr) {
          console.log('Error in API getting RPC response:');
          console.log(rpcErr);
          res.status(500).send(rpcErr);
        });
      };
    } // pass posts on this route to this method via this queue

  }, {
    key: "pass",
    value: function pass(route, method, queue) {
      if (this.expressListening) throw new Error('Unable to add passes after the API has started.');
      this.app.post(route, this.passAlongMethod(route, method, queue));
    }
  }, {
    key: "useCustomController",
    value: function useCustomController(route, controller) {
      if (this.expressListening) throw new Error('Unable to add controllers after the API has started.');
      this.app.use(route, controller);
    }
  }, {
    key: "enableCoreRoutes",
    value: function enableCoreRoutes() {
      this.useCustomController('/api', _coreRouter.default);
    }
  }, {
    key: "start",
    value: function start() {
      var _this3 = this;

      this.expressListening = true;
      this.app.listen(this.expressPort, function () {
        console.log("Pushkin API listening on port ".concat(_this3.expressPort));
      });
    }
  }]);

  return PushkinAPI;
}();

exports.default = PushkinAPI;