/*eslint-env node */
var path = require('path');

var loaders = [
  {test: /\.js$/, loader: 'babel'},
  {
    test: /\.css$/,
    exclude: /\.global\.css$/,
    loaders: [
      'style?sourceMap',
      'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
    ],
  },
  {test: /\.global\.css$/, loader: 'style!raw'},
];

module.exports = {
  entry: {
    main: './src/main.js',
  },
  output: {
    path: path.join(__dirname, 'assets'),
    publicPath: '/assets/',
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  module: {loaders: loaders},
};
