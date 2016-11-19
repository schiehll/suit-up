import React, {Component} from 'react'
import {render} from 'enzyme'
import {renderToJson} from 'enzyme-to-json'
import suitup from './index'
import parser from './parser'
import ThemeProvider from './ThemeProvider'

let style = ''

beforeEach(() => {
  style = `
    .blue {
      color: blue;
    }

    .red {
      color: red;
    }
  `
})

test('should wrap a component and inject styles prop', () => {
  @suitup(style)
  class BlueText extends Component {
    render () {
      const {styles, children} = this.props
      return (
        <div className={styles.blue}>
          {children}
        </div>
      )
    }
  }

  const component = render(
    <BlueText>Blue Content</BlueText>
  )

  expect(renderToJson(component)).toMatchSnapshot()
})

test('should insert a style tag in the document head', () => {
  @suitup(style)
  class BlueText extends Component {
    render () {
      const {styles, children} = this.props
      return (
        <div className={styles.blue}>
          {children}
        </div>
      )
    }
  }

  render(
    <BlueText>Blue Content</BlueText>
  )

  const styleEl = document.querySelectorAll('style')

  expect(styleEl.length).toBe(1)
})

test('should not insert the same css in the style tag twice', () => {
  @suitup(style)
  class BlueText extends Component {
    render () {
      const {styles, children} = this.props
      return (
        <div className={styles.blue}>
          {children}
        </div>
      )
    }
  }

  render(
    <BlueText>Blue Content</BlueText>
  )

  const styleEl = document.querySelector('style')
  let styleLength = styleEl.textContent.length

  @suitup(style)
  class RedText extends Component {
    render () {
      const {styles, children} = this.props
      return (
        <div className={styles.red}>
          {children}
        </div>
      )
    }
  }

  render(
    <RedText>Red Content</RedText>
  )

  styleLength = styleEl.textContent.length

  expect(styleLength).toEqual(styleLength)
})

test('should work as a wrapping function', () => {
  const BlueText = ({children, styles}) => {
    return (
      <div className={styles.blue}>
        {children}
      </div>
    )
  }

  const StyledBluetxt = suitup(style)(BlueText)

  const component = render(
    <StyledBluetxt>Blue Content</StyledBluetxt>
  )

  expect(renderToJson(component)).toMatchSnapshot()
})

test('should call styles passing the theme as arg if it is a function', () => {
  const btnStyle = theme => `
    .someClass {
      color: ${theme.color};
      background-color: ${theme.bg};
    }
  `

  const BlueText = ({children, styles}) => {
    return (
      <div className={styles.blue}>
        {children}
      </div>
    )
  }

  const StyledBluetxt = suitup(btnStyle)(BlueText)
  const theme = {
    color: 'blue',
    bg: 'gray'
  }

  let component = render(
    <ThemeProvider theme={theme}>
      <StyledBluetxt>Blue content with gray background</StyledBluetxt>
    </ThemeProvider>
  )

  expect(renderToJson(component)).toMatchSnapshot()
})

