import postcss from 'postcss'
import CSSModulesSync from 'postcss-modules-sync'
import cssnano from 'cssnano/dist/lib/core'
import autoprefixer from 'autoprefixer'
import StatsMap from 'stats-map'
import mem from 'mem'

class Parser {
  constructor (opts = {}) {
    this.tokens = {}
    const defaultOptions = {
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

    defaultOptions.plugins.push(
      autoprefixer({
        browsers: opts.browsers || defaultOptions.browsers
      })
    )

    const production = opts.hasOwnProperty('production')
      ? opts.production
      : defaultOptions.production

    if (production) defaultOptions.plugins.push(cssnano())

    this.options = {
      ...defaultOptions,
      ...opts
    }

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
