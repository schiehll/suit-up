import postcss from 'postcss'
import CSSModulesSync from 'postcss-modules-sync'
import cssnano from 'cssnano/dist/lib/core'
import autoprefixer from 'autoprefixer'
import StatsMap from 'stats-map'
import mem from 'mem'

class Parser {
  constructor (opts = {}) {
    this.tokens = {}
    this.options = {
      production: false,
      browsers: [],
      plugins: [
        CSSModulesSync({
          getTokens: exportedTokens => {
            this.tokens = exportedTokens
          }
        })
      ]
    }

    this.options.browsers = opts.hasOwnProperty('browsers')
      ? opts.browsers
      : this.options.browsers

    this.options.plugins.push(
      autoprefixer({
        browsers: this.options.browsers
      })
    )

    const production = opts.hasOwnProperty('production')
      ? opts.production
      : this.options.production

    if (production) this.options.plugins.push(cssnano())

    this.options.plugins = opts.hasOwnProperty('plugins')
      ? this.options.plugins.concat(opts.plugins)
      : this.options.plugins

    this.cache = new StatsMap()
    this.parse = mem(this._parse, {cache: this.cache})
  }

  _parse = cssToParse => {
    return {
      css: postcss(this.options.plugins).process(cssToParse).css,
      tokens: this.tokens
    }
  }
}

export default Parser
