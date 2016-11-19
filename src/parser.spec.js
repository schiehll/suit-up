import parser from './parser'

test('should parse a given css string, returning the parsed css and a token object with the generated classes names', () => {
  const css = `
    .someClass {
      color: black;
    }
  `

  const styles = parser.parse(css)

  expect(styles.hasOwnProperty('css')).toBe(true)
  expect(typeof styles.css === 'string').toBe(true)

  expect(styles.hasOwnProperty('tokens')).toBe(true)
  expect(typeof styles.tokens === 'object').toBe(true)
})

test('should chache the styles', () => {
  const css = `
    .someClass {
      color: blue;
    }
  `

  parser.parse(css)
  expect(parser.cache.hits).toEqual(0)

  parser.parse(css)
  expect(parser.cache.hits).toEqual(1)
})
