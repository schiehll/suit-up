import React from 'react'
import style from './Button.style'
import suitup from '../src/index'

const Button = ({children, styles, primary, ...rest}) => {
  return (
    <button
      className={primary ? styles.primary : styles.default}
      {...rest}
    >
      {children}
    </button>
  )
}

export default suitup(style)(Button)
