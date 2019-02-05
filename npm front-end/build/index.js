"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Pushkin =
/*#__PURE__*/
function () {
  function Pushkin() {
    _classCallCheck(this, Pushkin);

    this.con = undefined;
  }

  _createClass(Pushkin, [{
    key: "connect",
    value: function connect(quizAPIUrl) {
      this.con = _axios.default.create({
        baseURL: quizAPIUrl
      });
    }
  }, {
    key: "loadScript",
    value: function loadScript(url) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          return reject("Loading timed out for ".concat(url));
        }, 5000); // check if this script is already loaded and reload if it is
        // can't use array 'has' because getElements doesn't return an array

        var scripts = document.getElementsByTagName('script');

        for (var i = 0; i < scripts.length; i++) {
          if (scripts[i].src == url) scripts[i].parentNode.removeChild(scripts[i]);
        }

        var script = document.createElement('script');

        script.onload = function () {
          return resolve(_this);
        };

        script.src = url;
        document.body.appendChild(script);
      });
    }
  }, {
    key: "loadScripts",
    value: function loadScripts(urls) {
      return Promise.all(urls.map(this.loadScript));
    }
  }, {
    key: "prepExperimentRun",
    value: function prepExperimentRun() {
      return this.con.post('/startExperiment');
    }
  }, {
    key: "getAllStimuli",
    value: function getAllStimuli() {
      return this.con.post('/getStimuli').then(function (res) {
        var stimuli = res.data.resData;
        console.log(stimuli); // eslint-disable-line

        return stimuli.map(function (s) {
          return JSON.parse(s.stimulus);
        });
      });
    }
  }, {
    key: "setSaveAfterEachStimulus",
    value: function setSaveAfterEachStimulus(stimuli) {
      var _this2 = this;

      return stimuli.map(function (s) {
        return _objectSpread({}, s, {
          on_finish: _this2.saveStimulusResponse
        });
      });
    }
  }, {
    key: "saveStimulusResponse",
    value: function saveStimulusResponse(data) {
      var postData = {
        user_id: data.user_id,
        data_string: data
      };
      return this.con.post('/stimulusResponse', postData);
    }
  }, {
    key: "endExperiment",
    value: function endExperiment() {
      return this.con.post('/endExperiment');
    }
  }]);

  return Pushkin;
}();

exports.default = Pushkin;