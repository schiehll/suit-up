import React from 'react'
import style from './Button.style'
import suitup from '../src'

const Button = ({children, styles, ...rest}) => {
  return (
    <button
      className={styles.default}
      {...rest}
    >
      {children}
    </button>
  )
}

export default suitup(style)(Button)
