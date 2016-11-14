import PostCSSParser from './vendor/postcss/parse'
import local from './vendor/plugins/local-by-default'
import scope from './vendor/plugins/scope'
import CSSModulesParser from './vendor/plugins/parser'
import prefixer from './vendor/plugins/prefixer'
import HitMap from './HitMap'
import mem from 'mem'

const parse = cssToParse => {
  const root = PostCSSParser(cssToParse)
  local(root)
  scope(root)
  const tokens = CSSModulesParser(root)
  prefixer(root)
  const css = root.toResult().css

  return {css, tokens}
}

const cache = new HitMap()

const parser = {
  cache,
  parse: mem(parse, {cache})
}

export default parser
