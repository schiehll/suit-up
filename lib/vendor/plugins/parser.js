'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _icssReplaceSymbols = require('icss-replace-symbols');

var _icssReplaceSymbols2 = _interopRequireDefault(_icssReplaceSymbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exportTokens = {};
var translations = {};

var extractExports = function extractExports(css) {
  css.each(function (node) {
    if (node.type === 'rule' && node.selector === ':export') handleExport(node);
  });
};

var handleExport = function handleExport(exportNode) {
  exportNode.each(function (decl) {
    if (decl.type === 'decl') {
      Object.keys(translations).forEach(function (translation) {
        decl.value = decl.value.replace(translation, translations[translation]);
      });
      exportTokens[decl.prop] = decl.value;
    }
  });
  exportNode.remove();
};

var process = function process(css) {
  (0, _icssReplaceSymbols2.default)(css, translations);
  extractExports(css);

  return exportTokens;
};

exports.default = process;