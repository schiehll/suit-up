import Parser from './Parser'


test('should accept an options object and merge it with the default options', () => {
  const fakePlugin = () => 'fake'
  const options = {
    plugins: [fakePlugin],
    browsers: ['last 2 versions']
  }

  const parser = new Parser(options)
  const expected = {
    ...parser.options,
    ...options
  }

  expect(parser.options).toEqual(expected)
})

test('should parse a given css string, returning the parsed css and a token object with the generated classes names', () => {
  const parser = new Parser()
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
  const parser = new Parser()
  const css = `
    .someClass {
      color: black;
    }
  `

  let styles = parser.parse(css)
  let expected = {
    hits: 0,
    misses: 1
  }

  expect(parser.cache.stats).toEqual(expected)

  styles = parser.parse(css)
  expected = {
    hits: 1,
    misses: 1
  }

  expect(parser.cache.stats).toEqual(expected)
})

test('should minify the css if production option is set to true', () => {
  let parser = new Parser()
  const css = `
    .someClass {
      color: black;
    }

    .someOtherClass {
      color: white;
    }
  `

  let styles = parser.parse(css)
  const CSSLength = styles.css.length

  parser = new Parser({production: true})
  styles = parser.parse(css)
  const minifiedCSSLength = styles.css.length

  expect(CSSLength).toBeGreaterThan(minifiedCSSLength)
})