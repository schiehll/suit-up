import React, {Component} from 'react'
import renderer from 'react-test-renderer'
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

  const component = renderer.create(
    <BlueText>Blue Content</BlueText>
  ).toJSON()

  expect(component).toMatchSnapshot()
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

  const component = renderer.create(
    <BlueText>Blue Content</BlueText>
  ).toJSON()

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

  let component = renderer.create(
    <BlueText>Blue Content</BlueText>
  ).toJSON()

  const styleEl = document.querySelector('style')
  let styleLength = styleEl.textContent.length

  expect(parser.cache.stats.hits).toBe(0)

  @suitup(style)
  class RedText extends Component {
    render() {
      const {styles, children} = this.props
      return (
        <div className={styles.blue}>
          {children}
        </div>
      )
    }
  }

  component = renderer.create(
    <RedText>Red Content</RedText>
  ).toJSON()

  styleLength = styleEl.textContent.length

  expect(parser.cache.stats.hits).toBe(1)
  expect(styleLength).toEqual(styleLength)

})

