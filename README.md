# :necktie: suit-up

> css-in-js with template strings. For React.

[![travis build](https://img.shields.io/travis/schiehll/suit-up.svg?style=flat-square)](https://travis-ci.org/schiehll/suit-up)
[![version](https://img.shields.io/npm/v/suit-up.svg?style=flat-square)](http://npm.im/suit-up)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

## Benefits
 - No build step
 - Scoped selectors
 - Automatic vendor prefixing
 - Support global CSS
 - All CSS features included
 - Easy to override
 - Share constants between js and styles
 - Only load the styles that a component have used
 - Easily themeable

## Example
```js
import React, {Component} from 'react'
import {render} from 'react-dom'
import suitup from 'suit-up'

// it works with CSS Modules syntax for globals
const style = `
  :global .container {
    color: red;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
`

// local composes works too!
const buttonStyle = props => `
  .base {
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 10px 20px;
  }

  .default {
    composes: base;
    color: ${props.primary
      ? 'white'
      : 'black'
    };
    background-color: ${props.primary
      ? 'darkblue'
      : 'lightgray'
    };
  }
`

let Button = ({children, styles, primary, ...rest}) => {
  return (
    <button
      className={styles.default}
      {...rest}
    >
      {children}
    </button>
  )
}

Button = suitup(buttonStyle)(Button)

@suitup(style)
class App extends Component {
  render () {
    return (
      <div className='container'>
        <span>Red Text</span>
        <Button>Default Button</Button>
        <Button primary>Primary Button</Button>
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))
```
## Theme Example
```js
import React, {Component} from 'react'
import {render} from 'react-dom'
import suitup, {ThemeProvider} from 'suit-up'

const buttonStyle = (props, theme) => `
  .base {
    border: none;
    border-radius: ${theme.sizes.borderRadius}px;
    cursor: pointer;
    padding: ${theme.sizes.verticalPadding}px ${theme.sizes.horizontalPadding}px;
  }

  .default {
    composes: base;
    color: ${props.primary
      ? theme.colors.invertedText
      : theme.colors.text
    };
    background-color: ${props.primary
      ? theme.colors.primary
      : theme.colors.default
    };
  }
`

let Button = ({children, styles, primary, ...rest}) => {
  return (
    <button
      className={styles.default}
      {...rest}
    >
      {children}
    </button>
  )
}

Button = suitup(buttonStyle)(Button)

const someTheme = {
  colors: {
    default: 'lightgray',
    primary: 'darkblue',
    text: 'black',
    invertedText: 'white',
  },
  sizes: {
    borderRadius: 4,
    verticalPadding: 10,
    horizontalPadding: 20
  }
}

class App extends Component {
  render () {
    return (
      <ThemeProvider theme={someTheme}>
        <div>
          <Button>Default Button</Button>
          <Button primary>Primary Button</Button>
        </div>
      </ThemeProvider>
    )
  }
}

render(<App />, document.getElementById('app'))
```

# Acknowledgements
This is HIGHLY inspired by some amazing work:

- [CSS Modules](https://github.com/css-modules/css-modules)
- [styled-components](https://github.com/styled-components/styled-components)
- [jss](https://github.com/cssinjs/jss)
- [csjs](https://github.com/rtsao/csjs)
