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
  return class Suitup extends Component {
    constructor (props) {
      super(props)
      this.hits = 0
      this.parsedStyles = {}
    }

    static displayName = `Suitup(${_getDisplayName(WrappedComponent)})`

    componentWillMount = () => {
      this.hits = parser.cache.stats.hits
      this.parsedStyles = parser.parse(styles)

      if (parser.cache.stats.hits <= this.hits) {
        insertCSS(this.parsedStyles.css)
      }
    }

    render () {
      const {tokens} = this.parsedStyles
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
