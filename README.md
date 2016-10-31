# suit-up

> POC of a css-in-js approach that uses postcss to parse an ES6 template string. For react.

## Example
```js
import React, {Component} from 'react'
import {render} from 'react-dom'
import suitup, {setup} from 'suit-up'

const config = {
  plugins: [/* any postcss synchonous plugins */],
  production: false // when set to true, it minifies the parsed css before insert it in the DOM
}

setup(config)

// it work with CSS Modules syntax
const style = `
  :global .text {
    color: red;
  }

  .default {
    color: white;
  }

  .green {
    composes: default;
    background-color: green;
  }

  .blue {
    composes: default;
    background-color: blue;
  }
`

@suitup(style)
class App extends Component {
  render () {
    const {styles} = this.props

    return (
      <div className="text">
        Red text
        <p className={styles.green}>
          White text with green bg
        </p>
        <p className={styles.blue}>
          White text with blue bg
        </p>
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))

/* it work as a HOC too
const StyledApp = suitup(style)(App)
render(<StyledApp />, document.getElementById('app'))
*/

```
