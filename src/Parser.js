import postcss from 'postcss'
import CSSModulesSync from 'postcss-modules-sync'
import autoprefixer from 'autoprefixer'
import StatsMap from 'stats-map'
import mem from 'mem'

class Parser {
  constructor (opts = {}) {
    this.tokens = {}
    const defaultOptions = {
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
        browsers: []
      })
    )

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
