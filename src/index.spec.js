import React, {Component} from 'react'
import renderer from 'react-test-renderer'
import suitup, {setup} from './index'

setup()

const style = `
  .blue {
    color: blue;
  }
`

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
