import React, {Component} from 'react'
import {render} from 'react-dom'
import suitup, {ThemeProvider} from '../src/index'

const buttonStyle = theme => `
  .base {
    border: none;
    border-radius: ${theme.sizes.borderRadius}px;
    cursor: pointer;
    padding: ${theme.sizes.verticalPadding}px ${theme.sizes.horizontalPadding}px;
  }

  .default {
    composes: base;
    color: ${theme.colors.text};
    background-color: ${theme.colors.default};
  }

  .primary {
    composes: base;
    color: ${theme.colors.invertedText};
    background-color: ${theme.colors.primary};
  }
`
let Button = ({children, styles, primary, ...rest}) => {
  return (
    <button
      className={primary ? styles.primary : styles.default}
      {...rest}
    >
      {children}
    </button>
  )
}

Button = suitup(buttonStyle)(Button)

const theme = {
  colors: {
    default: 'lightgray',
    primary: 'darkblue',
    text: 'black',
    invertedText: 'white'
  },
  sizes: {
    borderRadius: 4,
    verticalPadding: 10,
    horizontalPadding: 10
  }
}

class App extends Component {
  render () {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <Button>Default Button</Button>
          <Button primary>Primary Button</Button>
        </div>
      </ThemeProvider>
    )
  }
}

render(<App />, document.getElementById('app'))
