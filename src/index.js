import React, {Component} from 'react'
import parser from './parser'
import insertCSS from 'insert-css'

const suitup = (...args) => {
  return _decorator(...args)
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
      this._injectSheet()
    }

    _injectSheet = () => {
      this.hits = parser.cache.hits
      this.parsedStyles = parser.parse(styles)

      if (parser.cache.hits <= this.hits) {
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

export default suitup
