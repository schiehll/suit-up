import postcss from 'postcss'
import CSSModulesSync from 'postcss-modules-sync'
import whitespace from 'postcss-whitespace'
import StatsMap from 'stats-map'
import mem from 'mem'

class Parser {
  constructor (opts = {}) {
    this.tokens = {}
    this.options = {
      production: false,
      plugins: [
        CSSModulesSync({
          getTokens: exportedTokens => {
            this.tokens = exportedTokens
          }
        })
      ]
    }

    this.options.production = opts.hasOwnProperty('production')
      ? opts.production
      : this.options.production

    if (this.options.production) {
      this.options.plugins.push(
        whitespace()
      )
    }

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
