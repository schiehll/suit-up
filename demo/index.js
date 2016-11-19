import React, {Component} from 'react'
import {render} from 'react-dom'
import {ThemeProvider} from '../src/index'
import Button from './Button'

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
        <div>
          <Button onClick={this.updateState}>Default Button</Button>
          <Button primary>Primary Button</Button>
        </div>
      </ThemeProvider>
    )
  }
}

render(<App />, document.getElementById('app'))
