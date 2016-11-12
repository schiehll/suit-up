'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HitMap = function () {
  function HitMap() {
    _classCallCheck(this, HitMap);

    this._map = new Map();

    this._hits = 0;
  }

  _createClass(HitMap, [{
    key: 'set',
    value: function set(key, value) {
      var _this = this;

      var data = value.data;

      Object.defineProperty(value, 'data', {
        get: function get() {
          _this._hits++;
          return data;
        }
      });

      this._map.set(key, value);
    }
  }, {
    key: 'get',
    value: function get(key) {
      return this._map.get(key);
    }
  }, {
    key: 'has',
    value: function has(key) {
      return this._map.has(key);
    }
  }, {
    key: 'hits',
    get: function get() {
      return this._hits;
    }
  }]);

  return HitMap;
}();

exports.default = HitMap;