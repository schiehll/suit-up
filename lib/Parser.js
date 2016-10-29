'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssModulesSync = require('postcss-modules-sync');

var _postcssModulesSync2 = _interopRequireDefault(_postcssModulesSync);

var _core = require('cssnano/dist/lib/core');

var _core2 = _interopRequireDefault(_core);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _statsMap = require('stats-map');

var _statsMap2 = _interopRequireDefault(_statsMap);

var _mem = require('mem');

var _mem2 = _interopRequireDefault(_mem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = function Parser() {
  var _this = this;

  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, Parser);

  this._parse = function (cssToParse) {
    return {
      css: (0, _postcss2.default)(_this.options.plugins).process(cssToParse).css,
      tokens: _this.tokens
    };
  };

  this.tokens = {};
  var defaultOptions = {
    production: false,
    browsers: [],
    plugins: [(0, _postcssModulesSync2.default)({
      getTokens: function getTokens(exportedTokens) {
        _this.tokens = exportedTokens;
      }
    })]
  };

  defaultOptions.plugins.push((0, _autoprefixer2.default)({
    browsers: opts.browsers || defaultOptions.browsers
  }));

  var production = opts.hasOwnProperty('production') ? opts.production : defaultOptions.production;

  if (production) defaultOptions.plugins.push((0, _core2.default)());

  this.options = _extends({}, defaultOptions, opts);

  this.cache = new _statsMap2.default();
  this.parse = (0, _mem2.default)(this._parse, { cache: this.cache });
};

exports.default = Parser;