import React, {Component} from 'react'
import Parser from './Parser'
import insertCSS from 'insert-css'

let parser = {}

const suitup = (...args) => {
  if (typeof args[0] === 'function') {
    return _HOC(...args)
  }

  return _decorator(...args)
}

export const setup = options => {
  parser = new Parser(options)

  return parser
}

const _wrap = (WrappedComponent, styles) => {
  const hits = parser.cache.stats.hits
  const parsedStyles = parser.parse(styles)

  if (parser.cache.stats.hits <= hits) {
    insertCSS(parsedStyles.css)
  }

  return class Suitup extends Component {
    static displayName = `Suitup(${_getDisplayName(WrappedComponent)})`

    render () {
      const {tokens} = parsedStyles
      return <WrappedComponent {...this.props} styles={tokens} />
    }
  }
}

const _getDisplayName = WrappedComponent => {
  return WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'
}

const _decorator = styles => {
  return WrappedComponent => {
    return _wrap(WrappedComponent, styles)
  }
}

const _HOC = (WrappedComponent, styles) => {
  return _wrap(WrappedComponent, styles)
}

export default suitup
