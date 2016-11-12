'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _declaration = require('./declaration');

var _declaration2 = _interopRequireDefault(_declaration);

var _warnOnce = require('./warn-once');

var _warnOnce2 = _interopRequireDefault(_warnOnce);

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function cleanSource(nodes) {
  return nodes.map(function (i) {
    if (i.nodes) i.nodes = cleanSource(i.nodes);
    delete i.source;
    return i;
  });
}

/**
 * The {@link Root}, {@link AtRule}, and {@link Rule} container nodes
 * inherit some common methods to help work with their children.
 *
 * Note that all containers can store any content. If you write a rule inside
 * a rule, PostCSS will parse it.
 *
 * @extends Node
 * @abstract
 */

var Container = function (_Node) {
  _inherits(Container, _Node);

  function Container() {
    _classCallCheck(this, Container);

    return _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).apply(this, arguments));
  }

  _createClass(Container, [{
    key: 'push',
    value: function push(child) {
      child.parent = this;
      this.nodes.push(child);
      return this;
    }

    /**
     * Iterates through the container’s immediate children,
     * calling `callback` for each child.
     *
     * Returning `false` in the callback will break iteration.
     *
     * This method only iterates through the container’s immediate children.
     * If you need to recursively iterate through all the container’s descendant
     * nodes, use {@link Container#walk}.
     *
     * Unlike the for `{}`-cycle or `Array#forEach` this iterator is safe
     * if you are mutating the array of child nodes during iteration.
     * PostCSS will adjust the current index to match the mutations.
     *
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * const root = postcss.parse('a { color: black; z-index: 1 }');
     * const rule = root.first;
     *
     * for ( let decl of rule.nodes ) {
     *     decl.cloneBefore({ prop: '-webkit-' + decl.prop });
     *     // Cycle will be infinite, because cloneBefore moves the current node
     *     // to the next index
     * }
     *
     * rule.each(decl => {
     *     decl.cloneBefore({ prop: '-webkit-' + decl.prop });
     *     // Will be executed only for color and z-index
     * });
     */

  }, {
    key: 'each',
    value: function each(callback) {
      if (!this.lastEach) this.lastEach = 0;
      if (!this.indexes) this.indexes = {};

      this.lastEach += 1;
      var id = this.lastEach;
      this.indexes[id] = 0;

      if (!this.nodes) return undefined;

      var index = void 0,
          result = void 0;
      while (this.indexes[id] < this.nodes.length) {
        index = this.indexes[id];
        result = callback(this.nodes[index], index);
        if (result === false) break;

        this.indexes[id] += 1;
      }

      delete this.indexes[id];

      return result;
    }

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each node.
     *
     * Like container.each(), this method is safe to use
     * if you are mutating arrays during iteration.
     *
     * If you only need to iterate through the container’s immediate children,
     * use {@link Container#each}.
     *
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * root.walk(node => {
     *   // Traverses all descendant nodes.
     * });
     */

  }, {
    key: 'walk',
    value: function walk(callback) {
      return this.each(function (child, i) {
        var result = callback(child, i);
        if (result !== false && child.walk) {
          result = child.walk(callback);
        }
        return result;
      });
    }

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each declaration node.
     *
     * If you pass a filter, iteration will only happen over declarations
     * with matching properties.
     *
     * Like {@link Container#each}, this method is safe
     * to use if you are mutating arrays during iteration.
     *
     * @param {string|RegExp} [prop]   - string or regular expression
     *                                   to filter declarations by property name
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * root.walkDecls(decl => {
     *   checkPropertySupport(decl.prop);
     * });
     *
     * root.walkDecls('border-radius', decl => {
     *   decl.remove();
     * });
     *
     * root.walkDecls(/^background/, decl => {
     *   decl.value = takeFirstColorFromGradient(decl.value);
     * });
     */

  }, {
    key: 'walkDecls',
    value: function walkDecls(prop, callback) {
      if (!callback) {
        callback = prop;
        return this.walk(function (child, i) {
          if (child.type === 'decl') {
            return callback(child, i);
          }
        });
      } else if (prop instanceof RegExp) {
        return this.walk(function (child, i) {
          if (child.type === 'decl' && prop.test(child.prop)) {
            return callback(child, i);
          }
        });
      } else {
        return this.walk(function (child, i) {
          if (child.type === 'decl' && child.prop === prop) {
            return callback(child, i);
          }
        });
      }
    }

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each rule node.
     *
     * If you pass a filter, iteration will only happen over rules
     * with matching selectors.
     *
     * Like {@link Container#each}, this method is safe
     * to use if you are mutating arrays during iteration.
     *
     * @param {string|RegExp} [selector] - string or regular expression
     *                                     to filter rules by selector
     * @param {childIterator} callback   - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * const selectors = [];
     * root.walkRules(rule => {
     *   selectors.push(rule.selector);
     * });
     * console.log(`Your CSS uses ${selectors.length} selectors`);
     */

  }, {
    key: 'walkRules',
    value: function walkRules(selector, callback) {
      if (!callback) {
        callback = selector;

        return this.walk(function (child, i) {
          if (child.type === 'rule') {
            return callback(child, i);
          }
        });
      } else if (selector instanceof RegExp) {
        return this.walk(function (child, i) {
          if (child.type === 'rule' && selector.test(child.selector)) {
            return callback(child, i);
          }
        });
      } else {
        return this.walk(function (child, i) {
          if (child.type === 'rule' && child.selector === selector) {
            return callback(child, i);
          }
        });
      }
    }

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each at-rule node.
     *
     * If you pass a filter, iteration will only happen over at-rules
     * that have matching names.
     *
     * Like {@link Container#each}, this method is safe
     * to use if you are mutating arrays during iteration.
     *
     * @param {string|RegExp} [name]   - string or regular expression
     *                                   to filter at-rules by name
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * root.walkAtRules(rule => {
     *   if ( isOld(rule.name) ) rule.remove();
     * });
     *
     * let first = false;
     * root.walkAtRules('charset', rule => {
     *   if ( !first ) {
     *     first = true;
     *   } else {
     *     rule.remove();
     *   }
     * });
     */

  }, {
    key: 'walkAtRules',
    value: function walkAtRules(name, callback) {
      if (!callback) {
        callback = name;
        return this.walk(function (child, i) {
          if (child.type === 'atrule') {
            return callback(child, i);
          }
        });
      } else if (name instanceof RegExp) {
        return this.walk(function (child, i) {
          if (child.type === 'atrule' && name.test(child.name)) {
            return callback(child, i);
          }
        });
      } else {
        return this.walk(function (child, i) {
          if (child.type === 'atrule' && child.name === name) {
            return callback(child, i);
          }
        });
      }
    }

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each comment node.
     *
     * Like {@link Container#each}, this method is safe
     * to use if you are mutating arrays during iteration.
     *
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * root.walkComments(comment => {
     *   comment.remove();
     * });
     */

  }, {
    key: 'walkComments',
    value: function walkComments(callback) {
      return this.walk(function (child, i) {
        if (child.type === 'comment') {
          return callback(child, i);
        }
      });
    }

    /**
     * Inserts new nodes to the start of the container.
     *
     * @param {...(Node|object|string|Node[])} children - new nodes
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * const decl1 = postcss.decl({ prop: 'color', value: 'black' });
     * const decl2 = postcss.decl({ prop: 'background-color', value: 'white' });
     * rule.append(decl1, decl2);
     *
     * root.append({ name: 'charset', params: '"UTF-8"' });  // at-rule
     * root.append({ selector: 'a' });                       // rule
     * rule.append({ prop: 'color', value: 'black' });       // declaration
     * rule.append({ text: 'Comment' })                      // comment
     *
     * root.append('a {}');
     * root.first.append('color: black; z-index: 1');
     */

  }, {
    key: 'append',
    value: function append() {
      for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
        children[_key] = arguments[_key];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var child = _step.value;

          var nodes = this.normalize(child, this.last);
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var node = _step2.value;
              this.nodes.push(node);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this;
    }

    /**
     * Inserts new nodes to the end of the container.
     *
     * @param {...(Node|object|string|Node[])} children - new nodes
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * const decl1 = postcss.decl({ prop: 'color', value: 'black' });
     * const decl2 = postcss.decl({ prop: 'background-color', value: 'white' });
     * rule.prepend(decl1, decl2);
     *
     * root.append({ name: 'charset', params: '"UTF-8"' });  // at-rule
     * root.append({ selector: 'a' });                       // rule
     * rule.append({ prop: 'color', value: 'black' });       // declaration
     * rule.append({ text: 'Comment' })                      // comment
     *
     * root.append('a {}');
     * root.first.append('color: black; z-index: 1');
     */

  }, {
    key: 'prepend',
    value: function prepend() {
      for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        children[_key2] = arguments[_key2];
      }

      children = children.reverse();
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var child = _step3.value;

          var nodes = this.normalize(child, this.first, 'prepend').reverse();
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = nodes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var node = _step4.value;
              this.nodes.unshift(node);
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }

          for (var id in this.indexes) {
            this.indexes[id] = this.indexes[id] + nodes.length;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return this;
    }
  }, {
    key: 'cleanRaws',
    value: function cleanRaws(keepBetween) {
      _get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'cleanRaws', this).call(this, keepBetween);
      if (this.nodes) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.nodes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var node = _step5.value;
            node.cleanRaws(keepBetween);
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      }
    }

    /**
     * Insert new node before old node within the container.
     *
     * @param {Node|number} exist             - child or child’s index.
     * @param {Node|object|string|Node[]} add - new node
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * rule.insertBefore(decl, decl.clone({ prop: '-webkit-' + decl.prop }));
     */

  }, {
    key: 'insertBefore',
    value: function insertBefore(exist, add) {
      exist = this.index(exist);

      var type = exist === 0 ? 'prepend' : false;
      var nodes = this.normalize(add, this.nodes[exist], type).reverse();
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = nodes[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var node = _step6.value;
          this.nodes.splice(exist, 0, node);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      var index = void 0;
      for (var id in this.indexes) {
        index = this.indexes[id];
        if (exist <= index) {
          this.indexes[id] = index + nodes.length;
        }
      }

      return this;
    }

    /**
     * Insert new node after old node within the container.
     *
     * @param {Node|number} exist             - child or child’s index
     * @param {Node|object|string|Node[]} add - new node
     *
     * @return {Node} this node for methods chain
     */

  }, {
    key: 'insertAfter',
    value: function insertAfter(exist, add) {
      exist = this.index(exist);

      var nodes = this.normalize(add, this.nodes[exist]).reverse();
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = nodes[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var node = _step7.value;
          this.nodes.splice(exist + 1, 0, node);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      var index = void 0;
      for (var id in this.indexes) {
        index = this.indexes[id];
        if (exist < index) {
          this.indexes[id] = index + nodes.length;
        }
      }

      return this;
    }
  }, {
    key: 'remove',
    value: function remove(child) {
      if (typeof child !== 'undefined') {
        (0, _warnOnce2.default)('Container#remove is deprecated. ' + 'Use Container#removeChild');
        this.removeChild(child);
      } else {
        _get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'remove', this).call(this);
      }
      return this;
    }

    /**
     * Removes node from the container and cleans the parent properties
     * from the node and its children.
     *
     * @param {Node|number} child - child or child’s index
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * rule.nodes.length  //=> 5
     * rule.removeChild(decl);
     * rule.nodes.length  //=> 4
     * decl.parent        //=> undefined
     */

  }, {
    key: 'removeChild',
    value: function removeChild(child) {
      child = this.index(child);
      this.nodes[child].parent = undefined;
      this.nodes.splice(child, 1);

      var index = void 0;
      for (var id in this.indexes) {
        index = this.indexes[id];
        if (index >= child) {
          this.indexes[id] = index - 1;
        }
      }

      return this;
    }

    /**
     * Removes all children from the container
     * and cleans their parent properties.
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * rule.removeAll();
     * rule.nodes.length //=> 0
     */

  }, {
    key: 'removeAll',
    value: function removeAll() {
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = this.nodes[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var node = _step8.value;
          node.parent = undefined;
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      this.nodes = [];
      return this;
    }

    /**
     * Passes all declaration values within the container that match pattern
     * through callback, replacing those values with the returned result
     * of callback.
     *
     * This method is useful if you are using a custom unit or function
     * and need to iterate through all values.
     *
     * @param {string|RegExp} pattern      - replace pattern
     * @param {object} opts                - options to speed up the search
     * @param {string|string[]} opts.props - an array of property names
     * @param {string} opts.fast           - string that’s used
     *                                       to narrow down values and speed up
                                             the regexp search
     * @param {function|string} callback   - string to replace pattern
     *                                       or callback that returns a new
     *                                       value.
     *                                       The callback will receive
     *                                       the same arguments as those
     *                                       passed to a function parameter
     *                                       of `String#replace`.
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * root.replaceValues(/\d+rem/, { fast: 'rem' }, string => {
     *   return 15 * parseInt(string) + 'px';
     * });
     */

  }, {
    key: 'replaceValues',
    value: function replaceValues(pattern, opts, callback) {
      if (!callback) {
        callback = opts;
        opts = {};
      }

      this.walkDecls(function (decl) {
        if (opts.props && opts.props.indexOf(decl.prop) === -1) return;
        if (opts.fast && decl.value.indexOf(opts.fast) === -1) return;

        decl.value = decl.value.replace(pattern, callback);
      });

      return this;
    }

    /**
     * Returns `true` if callback returns `true`
     * for all of the container’s children.
     *
     * @param {childCondition} condition - iterator returns true or false.
     *
     * @return {boolean} is every child pass condition
     *
     * @example
     * const noPrefixes = rule.every(i => i.prop[0] !== '-');
     */

  }, {
    key: 'every',
    value: function every(condition) {
      return this.nodes.every(condition);
    }

    /**
     * Returns `true` if callback returns `true` for (at least) one
     * of the container’s children.
     *
     * @param {childCondition} condition - iterator returns true or false.
     *
     * @return {boolean} is some child pass condition
     *
     * @example
     * const hasPrefix = rule.some(i => i.prop[0] === '-');
     */

  }, {
    key: 'some',
    value: function some(condition) {
      return this.nodes.some(condition);
    }

    /**
     * Returns a `child`’s index within the {@link Container#nodes} array.
     *
     * @param {Node} child - child of the current container.
     *
     * @return {number} child index
     *
     * @example
     * rule.index( rule.nodes[2] ) //=> 2
     */

  }, {
    key: 'index',
    value: function index(child) {
      if (typeof child === 'number') {
        return child;
      } else {
        return this.nodes.indexOf(child);
      }
    }

    /**
     * The container’s first child.
     *
     * @type {Node}
     *
     * @example
     * rule.first == rules.nodes[0];
     */

  }, {
    key: 'normalize',
    value: function normalize(nodes, sample) {
      var _this2 = this;

      if (typeof nodes === 'string') {
        var parse = require('./parse');
        nodes = cleanSource(parse(nodes).nodes);
      } else if (!Array.isArray(nodes)) {
        if (nodes.type === 'root') {
          nodes = nodes.nodes;
        } else if (nodes.type) {
          nodes = [nodes];
        } else if (nodes.prop) {
          if (typeof nodes.value === 'undefined') {
            throw new Error('Value field is missed in node creation');
          } else if (typeof nodes.value !== 'string') {
            nodes.value = String(nodes.value);
          }
          nodes = [new _declaration2.default(nodes)];
        } else if (nodes.selector) {
          var Rule = require('./rule');
          nodes = [new Rule(nodes)];
        } else if (nodes.name) {
          var AtRule = require('./at-rule');
          nodes = [new AtRule(nodes)];
        } else if (nodes.text) {
          nodes = [new _comment2.default(nodes)];
        } else {
          throw new Error('Unknown node type in node creation');
        }
      }

      var processed = nodes.map(function (i) {
        if (typeof i.raws === 'undefined') i = _this2.rebuild(i);

        if (i.parent) i = i.clone();
        if (typeof i.raws.before === 'undefined') {
          if (sample && typeof sample.raws.before !== 'undefined') {
            i.raws.before = sample.raws.before.replace(/[^\s]/g, '');
          }
        }
        i.parent = _this2;
        return i;
      });

      return processed;
    }
  }, {
    key: 'rebuild',
    value: function rebuild(node, parent) {
      var _this3 = this;

      var fix = void 0;
      if (node.type === 'root') {
        var Root = require('./root');
        fix = new Root();
      } else if (node.type === 'atrule') {
        var AtRule = require('./at-rule');
        fix = new AtRule();
      } else if (node.type === 'rule') {
        var Rule = require('./rule');
        fix = new Rule();
      } else if (node.type === 'decl') {
        fix = new _declaration2.default();
      } else if (node.type === 'comment') {
        fix = new _comment2.default();
      }

      for (var i in node) {
        if (i === 'nodes') {
          fix.nodes = node.nodes.map(function (j) {
            return _this3.rebuild(j, fix);
          });
        } else if (i === 'parent' && parent) {
          fix.parent = parent;
        } else if (node.hasOwnProperty(i)) {
          fix[i] = node[i];
        }
      }

      return fix;
    }
  }, {
    key: 'eachInside',
    value: function eachInside(callback) {
      (0, _warnOnce2.default)('Container#eachInside is deprecated. ' + 'Use Container#walk instead.');
      return this.walk(callback);
    }
  }, {
    key: 'eachDecl',
    value: function eachDecl(prop, callback) {
      (0, _warnOnce2.default)('Container#eachDecl is deprecated. ' + 'Use Container#walkDecls instead.');
      return this.walkDecls(prop, callback);
    }
  }, {
    key: 'eachRule',
    value: function eachRule(selector, callback) {
      (0, _warnOnce2.default)('Container#eachRule is deprecated. ' + 'Use Container#walkRules instead.');
      return this.walkRules(selector, callback);
    }
  }, {
    key: 'eachAtRule',
    value: function eachAtRule(name, callback) {
      (0, _warnOnce2.default)('Container#eachAtRule is deprecated. ' + 'Use Container#walkAtRules instead.');
      return this.walkAtRules(name, callback);
    }
  }, {
    key: 'eachComment',
    value: function eachComment(callback) {
      (0, _warnOnce2.default)('Container#eachComment is deprecated. ' + 'Use Container#walkComments instead.');
      return this.walkComments(callback);
    }
  }, {
    key: 'first',
    get: function get() {
      if (!this.nodes) return undefined;
      return this.nodes[0];
    }

    /**
     * The container’s last child.
     *
     * @type {Node}
     *
     * @example
     * rule.last == rule.nodes[rule.nodes.length - 1];
     */

  }, {
    key: 'last',
    get: function get() {
      if (!this.nodes) return undefined;
      return this.nodes[this.nodes.length - 1];
    }
  }, {
    key: 'semicolon',
    get: function get() {
      (0, _warnOnce2.default)('Node#semicolon is deprecated. Use Node#raws.semicolon');
      return this.raws.semicolon;
    },
    set: function set(val) {
      (0, _warnOnce2.default)('Node#semicolon is deprecated. Use Node#raws.semicolon');
      this.raws.semicolon = val;
    }
  }, {
    key: 'after',
    get: function get() {
      (0, _warnOnce2.default)('Node#after is deprecated. Use Node#raws.after');
      return this.raws.after;
    },
    set: function set(val) {
      (0, _warnOnce2.default)('Node#after is deprecated. Use Node#raws.after');
      this.raws.after = val;
    }

    /**
     * @memberof Container#
     * @member {Node[]} nodes - an array containing the container’s children
     *
     * @example
     * const root = postcss.parse('a { color: black }');
     * root.nodes.length           //=> 1
     * root.nodes[0].selector      //=> 'a'
     * root.nodes[0].nodes[0].prop //=> 'color'
     */

  }]);

  return Container;
}(_node2.default);

exports.default = Container;

/**
 * @callback childCondition
 * @param {Node} node    - container child
 * @param {number} index - child index
 * @param {Node[]} nodes - all container children
 * @return {boolean}
 */

/**
 * @callback childIterator
 * @param {Node} node    - container child
 * @param {number} index - child index
 * @return {false|undefined} returning `false` will break iteration
 */