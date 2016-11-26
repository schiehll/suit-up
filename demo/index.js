import React, {Component} from 'react'
import {render} from 'react-dom'
import suitup, {ThemeProvider} from '../src'
import Button from './Button'

const theme = {
  colors: {
    default: 'lightgray',
    primary: 'darkblue',
    text: 'black',
    invertedText: 'white'
  },
  sizes: {
    borderRadius: 6,
    verticalPadding: 10,
    horizontalPadding: 10
  }
}

const bgStyle = theme => `
  .default > button {
    border-radius: ${theme.sizes.borderRadius}px;
  }

  .default > button:first-child {
    border-radius: ${theme.sizes.borderRadius}px 0 0 ${theme.sizes.borderRadius}px;
  }

  .default > button:last-child {
    border-radius: 0 ${theme.sizes.borderRadius}px ${theme.sizes.borderRadius}px 0;
  }
`

let ButtonGroup = ({children, styles, ...rest}) => {
  return (
    <span className={styles.default} {...rest}>{children}</span>
  )
}

ButtonGroup = suitup(bgStyle)(ButtonGroup)

class App extends Component {
  state = {
    update: false
  }

  updateState = e => {
    e.preventDefault()
    const {update} = this.state

    this.setState({update: !update})
  }

  render () {
    return (
      <ThemeProvider theme={theme}>
        <ButtonGroup>
          <Button onClick={this.updateState}>Button 1</Button>
          <Button>Button 2</Button>
        </ButtonGroup>
      </ThemeProvider>
    )
  }
}

render(<App />, document.getElementById('app'))
