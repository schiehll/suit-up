import path from 'path'

export default {
  devtool: 'source-map',
  entry: path.join(__dirname, 'index.js'),

  output: {
    path: path.join(__dirname, 'js'),
    filename: '[name].js',
    publicPath: '/js/'
  },

  module: {
    loaders: [
      {
        test: /\.js?/,
        loader: 'babel'
      },
      {
        test: /\.json?/,
        loader: 'json'
      }
    ]
  }
}
