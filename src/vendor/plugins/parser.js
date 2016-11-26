import replaceSymbols from 'icss-replace-symbols'

const process = css => {
  let exportTokens = {}
  let translations = {}

  replaceSymbols(css, translations)

  css.each(node => {
    if (node.type === 'rule' && node.selector === ':export') {
      node.each(decl => {
        if (decl.type === 'decl') {
          Object.keys(translations).forEach(translation => {
            decl.value = decl.value.replace(translation, translations[translation])
          })
          exportTokens[decl.prop] = decl.value
        }
      })
      node.remove()
    }
  })

  return exportTokens
}

export default process
