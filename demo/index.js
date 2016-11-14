import React, {Component} from 'react'
import {render} from 'react-dom'
import suitup, {ThemeProvider} from '../src/index'

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
