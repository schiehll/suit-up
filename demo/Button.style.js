const style = theme => `
  .base {
    border: none;
    border-radius: ${theme.sizes.borderRadius};
    cursor: pointer;
    padding: 10px 20px;
  }

  .default {
    composes: base;
    background-color: gray;
    color: black;
  }
`

export default style
