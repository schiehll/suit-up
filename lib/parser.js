'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parse = require('./vendor/postcss/parse');

var _parse2 = _interopRequireDefault(_parse);

var _localByDefault = require('./vendor/plugins/local-by-default');

var _localByDefault2 = _interopRequireDefault(_localByDefault);

var _scope = require('./vendor/plugins/scope');

var _scope2 = _interopRequireDefault(_scope);

var _parser = require('./vendor/plugins/parser');

var _parser2 = _interopRequireDefault(_parser);

var _prefixer = require('./vendor/plugins/prefixer');

var _prefixer2 = _interopRequireDefault(_prefixer);

var _whitespace = require('./vendor/plugins/whitespace');

var _whitespace2 = _interopRequireDefault(_whitespace);

var _HitMap = require('./HitMap');

var _HitMap2 = _interopRequireDefault(_HitMap);

var _mem = require('mem');

var _mem2 = _interopRequireDefault(_mem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parse = function parse(cssToParse) {
  var root = (0, _parse2.default)(cssToParse);
  (0, _localByDefault2.default)(root);
  (0, _scope2.default)(root);
  var tokens = (0, _parser2.default)(root);
  (0, _prefixer2.default)(root);
  (0, _whitespace2.default)(root);
  var css = root.toResult().css;

  return { css: css, tokens: tokens };
};

var cache = new _HitMap2.default();

var parser = {
  cache: cache,
  parse: (0, _mem2.default)(parse, { cache: cache })
};

exports.default = parser;