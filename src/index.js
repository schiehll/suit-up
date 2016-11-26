import React, {Component} from 'react'
import parser from './parser'
import ThemeProvider from './ThemeProvider'
import insertCSS from 'insert-css'

const suitup = styles => {
  return WrappedComponent => {
    return class extends Component {
      static displayName = `Suitup(${_getDisplayName(WrappedComponent)})`

      static contextTypes = {
        theme: React.PropTypes.object
      }

      _injectSheet = () => {
        const stylesToParse = typeof styles === 'function'
          ? styles(this.context.theme)
          : styles

        const hits = parser.cache.hits
        const parsedStyles = parser.parse(stylesToParse)

        if (parser.cache.hits <= hits) {
          insertCSS(parsedStyles.css)
        }

        return parsedStyles.tokens
      }

      render () {
        const tokens = this._injectSheet()
        return <WrappedComponent {...this.props} styles={tokens} />
      }
    }
  }
}

const _getDisplayName = WrappedComponent => {
  return WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'
}

export {ThemeProvider}
export default suitup
