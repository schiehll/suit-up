import features from '../features.json'
import PostCSSRule from '../postcss/rule'

const mergePrefix = (feature, prefix) => {
  return `${prefix}${feature}`
}

const process = css => {
  css.walkDecls(decl => {
    features.forEach(feature => {
      if (feature.name === decl.prop) {
        feature.prefixes.forEach(prefix => {
          decl.cloneBefore({
            prop: mergePrefix(decl.prop, prefix),
            value: decl.value
          })
        })
      } else if (feature.name === decl.value) {
        feature.prefixes.forEach(prefix => {
          decl.cloneBefore({
            prop: decl.prop,
            value: mergePrefix(decl.value, prefix)
          })
        })
      }
    })
  })

  css.walkAtRules(rule => {
    features.forEach(feature => {
      if (feature.name === `@${rule.name}`) {
        feature.prefixes.forEach(prefix => {
          rule.parent.insertBefore(rule, new PostCSSRule({
            ...rule,
            selector: `@${mergePrefix(rule.name, prefix)} ${rule.params}`
          }))
        })
      }
    })
  })
}

export default process
