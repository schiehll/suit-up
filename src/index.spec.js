import React, {Component} from 'react'
//import renderer from 'react-test-renderer'
import {render} from 'enzyme'
import {renderToJson} from 'enzyme-to-json'
import suitup, {setup} from './index'

let parser = null
let style = ''

beforeEach(() => {
  parser = setup()

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
    render() {
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
    render() {
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

  const styleEl = document.querySelectorAll('style')

  expect(styleEl.length).toBe(1)
})

test('should not insert the same css in the style tag twice', () => {
  @suitup(style)
  class BlueText extends Component {
    render() {
      const {styles, children} = this.props
      return (
        <div className={styles.blue}>
          {children}
        </div>
      )
    }
  }

  let component = render(
    <BlueText>Blue Content</BlueText>
  )

  const styleEl = document.querySelector('style')
  let styleLength = styleEl.textContent.length

  expect(parser.cache.stats.hits).toBe(0)

  @suitup(style)
  class RedText extends Component {
    render() {
      const {styles, children} = this.props
      return (
        <div className={styles.red}>
          {children}
        </div>
      )
    }
  }

  component = render(
    <RedText>Red Content</RedText>
  )

  styleLength = styleEl.textContent.length

  expect(parser.cache.stats.hits).toBe(1)
  expect(styleLength).toEqual(styleLength)
})

test('should work as a HOC', () => {
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

