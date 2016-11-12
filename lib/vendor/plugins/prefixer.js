'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _features = require('../features.json');

var _features2 = _interopRequireDefault(_features);

var _rule = require('../postcss/rule');

var _rule2 = _interopRequireDefault(_rule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mergePrefix = function mergePrefix(feature, prefix) {
  return '' + prefix + feature;
};

var process = function process(css) {
  css.walkDecls(function (decl) {
    _features2.default.forEach(function (feature) {
      if (feature.name === decl.prop) {
        feature.prefixes.forEach(function (prefix) {
          decl.cloneBefore({
            prop: mergePrefix(decl.prop, prefix),
            value: decl.value
          });
        });
      } else if (feature.name === decl.value) {
        feature.prefixes.forEach(function (prefix) {
          decl.cloneBefore({
            prop: decl.prop,
            value: mergePrefix(decl.value, prefix)
          });
        });
      }
    });
  });

  css.walkAtRules(function (rule) {
    _features2.default.forEach(function (feature) {
      if (feature.name === '@' + rule.name) {
        feature.prefixes.forEach(function (prefix) {
          rule.parent.insertBefore(rule, new _rule2.default(_extends({}, rule, {
            selector: '@' + mergePrefix(rule.name, prefix) + ' ' + rule.params
          })));
        });
      }
    });
  });
};

exports.default = process;