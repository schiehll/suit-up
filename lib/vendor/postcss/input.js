'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cssSyntaxError = require('./css-syntax-error');

var _cssSyntaxError2 = _interopRequireDefault(_cssSyntaxError);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sequence = 0;

/**
 * Represents the source CSS.
 *
 * @example
 * const root  = postcss.parse(css, { from: file });
 * const input = root.source.input;
 */

var Input = function () {

  /**
   * @param {string} css    - input CSS source
   * @param {object} [opts] - {@link Processor#process} options
   */
  function Input(css) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Input);

    /**
     * @member {string} - input CSS source
     *
     * @example
     * const input = postcss.parse('a{}', { from: file }).input;
     * input.css //=> "a{}";
     */
    this.css = css.toString();

    if (this.css[0] === '\uFEFF' || this.css[0] === '\uFFFE') {
      this.css = this.css.slice(1);
    }

    if (opts.from) {
      if (/^\w+:\/\//.test(opts.from)) {
        /**
         * @member {string} - The absolute path to the CSS source file
         *                    defined with the `from` option.
         *
         * @example
         * const root = postcss.parse(css, { from: 'a.css' });
         * root.source.input.file //=> '/home/ai/a.css'
         */
        this.file = opts.from;
      } else {
        this.file = _path2.default.resolve(opts.from);
      }
    }

    if (!this.file) {
      sequence += 1;
      /**
       * @member {string} - The unique ID of the CSS source. It will be
       *                    created if `from` option is not provided
       *                    (because PostCSS does not know the file path).
       *
       * @example
       * const root = postcss.parse(css);
       * root.source.input.file //=> undefined
       * root.source.input.id   //=> "<input css 1>"
       */
      this.id = '<input css ' + sequence + '>';
    }
    if (this.map) this.map.file = this.from;
  }

  _createClass(Input, [{
    key: 'error',
    value: function error(message, line, column) {
      var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      var result = void 0;
      var origin = this.origin(line, column);
      if (origin) {
        result = new _cssSyntaxError2.default(message, origin.line, origin.column, origin.source, origin.file, opts.plugin);
      } else {
        result = new _cssSyntaxError2.default(message, line, column, this.css, this.file, opts.plugin);
      }

      result.input = { line: line, column: column, source: this.css };
      if (this.file) result.input.file = this.file;

      return result;
    }

    /**
     * Reads the input source map and returns a symbol position
     * in the input source (e.g., in a Sass file that was compiled
     * to CSS before being passed to PostCSS).
     *
     * @param {number} line   - line in input CSS
     * @param {number} column - column in input CSS
     *
     * @return {filePosition} position in input source
     *
     * @example
     * root.source.input.origin(1, 1) //=> { file: 'a.css', line: 3, column: 1 }
     */

  }, {
    key: 'origin',
    value: function origin(line, column) {
      if (!this.map) return false;
      var consumer = this.map.consumer();

      var from = consumer.originalPositionFor({ line: line, column: column });
      if (!from.source) return false;

      var result = {
        file: this.mapResolve(from.source),
        line: from.line,
        column: from.column
      };

      var source = consumer.sourceContentFor(from.source);
      if (source) result.source = source;

      return result;
    }
  }, {
    key: 'mapResolve',
    value: function mapResolve(file) {
      if (/^\w+:\/\//.test(file)) {
        return file;
      } else {
        return _path2.default.resolve(this.map.consumer().sourceRoot || '.', file);
      }
    }

    /**
     * The CSS source identifier. Contains {@link Input#file} if the user
     * set the `from` option, or {@link Input#id} if they did not.
     * @type {string}
     *
     * @example
     * const root = postcss.parse(css, { from: 'a.css' });
     * root.source.input.from //=> "/home/ai/a.css"
     *
     * const root = postcss.parse(css);
     * root.source.input.from //=> "<input css 1>"
     */

  }, {
    key: 'from',
    get: function get() {
      return this.file || this.id;
    }
  }]);

  return Input;
}();

exports.default = Input;

/**
 * @typedef  {object} filePosition
 * @property {string} file   - path to file
 * @property {number} line   - source line in file
 * @property {number} column - source column in file
 */