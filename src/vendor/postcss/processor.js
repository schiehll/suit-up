import LazyResult from './lazy-result'

/**
 * Contains plugins to process CSS. Create one `Processor` instance,
 * initialize its plugins, and then use that instance on numerous CSS files.
 *
 * @example
 * const processor = postcss([autoprefixer, precss]);
 * processor.process(css1).then(result => console.log(result.css));
 * processor.process(css2).then(result => console.log(result.css));
 */
class Processor {

    /**
     * @param {Array.<Plugin|pluginFunction>|Processor} plugins - PostCSS
     *        plugins. See {@link Processor#use} for plugin format.
     */
  constructor (plugins = []) {
        /**
         * @member {string} - Current PostCSS version.
         *
         * @example
         * if ( result.processor.version.split('.')[0] !== '5' ) {
         *   throw new Error('This plugin works only with PostCSS 5');
         * }
         */
    this.version = '5.2.5'
        /**
         * @member {pluginFunction[]} - Plugins added to this processor.
         *
         * @example
         * const processor = postcss([autoprefixer, precss]);
         * processor.plugins.length //=> 2
         */
    this.plugins = this.normalize(plugins)
  }

    /**
     * Adds a plugin to be used as a CSS processor.
     *
     * PostCSS plugin can be in 4 formats:
     * * A plugin created by {@link postcss.plugin} method.
     * * A function. PostCSS will pass the function a @{link Root}
     *   as the first argument and current {@link Result} instance
     *   as the second.
     * * An object with a `postcss` method. PostCSS will use that method
     *   as described in #2.
     * * Another {@link Processor} instance. PostCSS will copy plugins
     *   from that instance into this one.
     *
     * Plugins can also be added by passing them as arguments when creating
     * a `postcss` instance (see [`postcss(plugins)`]).
     *
     * Asynchronous plugins should return a `Promise` instance.
     *
     * @param {Plugin|pluginFunction|Processor} plugin - PostCSS plugin
     *                                                   or {@link Processor}
     *                                                   with plugins
     *
     * @example
     * const processor = postcss()
     *   .use(autoprefixer)
     *   .use(precss);
     *
     * @return {Processes} current processor to make methods chain
     */
  use (plugin) {
    this.plugins = this.plugins.concat(this.normalize([plugin]))
    return this
  }

    /**
     * Parses source CSS and returns a {@link LazyResult} Promise proxy.
     * Because some plugins can be asynchronous it doesn’t make
     * any transformations. Transformations will be applied
     * in the {@link LazyResult} methods.
     *
     * @param {string|toString|Result} css - String with input CSS or
     *                                       any object with a `toString()`
     *                                       method, like a Buffer.
     *                                       Optionally, send a {@link Result}
     *                                       instance and the processor will
     *                                       take the {@link Root} from it.
     * @param {processOptions} [opts]      - options
     *
     * @return {LazyResult} Promise proxy
     *
     * @example
     * processor.process(css, { from: 'a.css', to: 'a.out.css' })
     *   .then(result => {
     *      console.log(result.css);
     *   });
     */
  process (css, opts = { }) {
    return new LazyResult(this, css, opts)
  }

  normalize (plugins) {
    let normalized = []
    for (let i of plugins) {
      if (i.postcss) i = i.postcss

      if (typeof i === 'object' && Array.isArray(i.plugins)) {
        normalized = normalized.concat(i.plugins)
      } else if (typeof i === 'function') {
        normalized.push(i)
      } else {
        throw new Error(i + ' is not a PostCSS plugin')
      }
    }
    return normalized
  }

}

export default Processor
