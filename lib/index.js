'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Parser = require('./Parser');

var _Parser2 = _interopRequireDefault(_Parser);

var _insertCss = require('insert-css');

var _insertCss2 = _interopRequireDefault(_insertCss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var parser = {};

var suitup = function suitup() {
  return _decorator.apply(undefined, arguments);
};

var setup = exports.setup = function setup(options) {
  parser = new _Parser2.default(options);

  return parser;
};

var _wrap = function _wrap(WrappedComponent, styles) {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    _inherits(Suitup, _Component);

    function Suitup(props) {
      _classCallCheck(this, Suitup);

      var _this = _possibleConstructorReturn(this, (Suitup.__proto__ || Object.getPrototypeOf(Suitup)).call(this, props));

      _this.componentWillMount = function () {
        _this.hits = parser.cache.stats.hits;
        _this.parsedStyles = parser.parse(styles);

        if (parser.cache.stats.hits <= _this.hits) {
          (0, _insertCss2.default)(_this.parsedStyles.css);
        }
      };

      _this.hits = 0;
      _this.parsedStyles = {};
      return _this;
    }

    _createClass(Suitup, [{
      key: 'render',
      value: function render() {
        var tokens = this.parsedStyles.tokens;

        return _react2.default.createElement(WrappedComponent, _extends({}, this.props, { styles: tokens }));
      }
    }]);

    return Suitup;
  }(_react.Component), _class.displayName = 'Suitup(' + _getDisplayName(WrappedComponent) + ')', _temp;
};

var _getDisplayName = function _getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

var _decorator = function _decorator(styles) {
  return function (WrappedComponent) {
    return _wrap(WrappedComponent, styles);
  };
};

exports.default = suitup;