import React, {Component} from 'react'
import {render} from 'react-dom'
import suitup from '../lib/index'

// it works with CSS Modules syntax for globals
const style = `
  :global .container {
    color: red;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  :global .container > * {
    margin: 0 10px;
  }
`

// local composes works too!
const buttonStyles = `
  .base {
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 10px 20px;
  }

  .default {
    composes: base;
    color: black;
    background-color: lightgray;
  }

  .primary {
    composes: base;
    color: white;
    background-color: darkblue;
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

Button = suitup(buttonStyles)(Button)

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
