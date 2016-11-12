import replaceSymbols from 'icss-replace-symbols'

let exportTokens = {}
let translations = {}

const extractExports = css => {
  css.each(node => {
    if (node.type === 'rule' && node.selector === ':export') handleExport(node)
  })
}

const handleExport = exportNode => {
  exportNode.each(decl => {
    if (decl.type === 'decl') {
      Object.keys(translations).forEach(translation => {
        decl.value = decl.value.replace(translation, translations[translation])
      })
      exportTokens[decl.prop] = decl.value
    }
  })
  exportNode.remove()
}

const process = css => {
  replaceSymbols(css, translations)
  extractExports(css)

  return exportTokens
}

export default process
