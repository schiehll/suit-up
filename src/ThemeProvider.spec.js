import React, {Component} from 'react'
import {mount} from 'enzyme'
import ThemeProvider from './ThemeProvider'
import suitup from './index'
import parser from './parser'

test('should accept a theme prop and pass it down with context', () => {
  const style = theme => `
    .someClass {
      color: ${theme.color}
    }
  `

  const theme = {
    color: 'gray'
  }

  @suitup(style)
  class Text extends Component {
    render () {
      const {styles, children} = this.props
      return (
        <div className={styles.red}>
          {children}
        </div>
      )
    }
  }

  const component = mount(
    <ThemeProvider theme={theme}>
      <Text>Some Text</Text>
    </ThemeProvider>
  )

  let styles = parser.parse(`
    .someClass {
      color: ${theme.color}
    }
  `)

  const cssClass = component.find('Text').props().styles.someClass

  expect(styles.css.trim().replace(/\s+/g, ' ')).toEqual(`.${cssClass} { color: ${theme.color} }`)
})
