'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssModulesSync = require('postcss-modules-sync');

var _postcssModulesSync2 = _interopRequireDefault(_postcssModulesSync);

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
  this.options = {
    production: false,
    browsers: [],
    plugins: [(0, _postcssModulesSync2.default)({
      getTokens: function getTokens(exportedTokens) {
        _this.tokens = exportedTokens;
      }
    })]
  };

  this.options.browsers = opts.hasOwnProperty('browsers') ? opts.browsers : this.options.browsers;

  this.options.plugins.push((0, _autoprefixer2.default)({
    browsers: this.options.browsers
  }));

  var production = opts.hasOwnProperty('production') ? opts.production : this.options.production;

  if (production) {
    this.options.plugins.push(require('cssnano/dist/lib/core')());
  }

  this.options.plugins = opts.hasOwnProperty('plugins') ? this.options.plugins.concat(opts.plugins) : this.options.plugins;

  this.cache = new _statsMap2.default();
  this.parse = (0, _mem2.default)(this._parse, { cache: this.cache });
};

exports.default = Parser;