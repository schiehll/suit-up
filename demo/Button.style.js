const style = ({sizes, colors}) => `
  .base {
    border: none;
    border-radius: ${sizes.borderRadius}px;
    cursor: pointer;
    padding: ${sizes.verticalPadding}px ${sizes.horizontalPadding}px;
  }

  .default {
    composes: base;
    background-color: ${colors.default};
    color: ${colors.text};
  }

  .primary {
    composes: base;
    background-color: ${colors.primary};
    color: ${colors.invertedText};
  }
`

export default style
