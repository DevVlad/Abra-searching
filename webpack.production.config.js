var webpack = require('webpack');
var path = require('path');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'cheap-source-map',
  entry: [
    path.resolve(__dirname, 'my-duck/main.jsx'),
  ],
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: './bundle.js'
  },
  module: {
    loaders:[
      { test: /\.css$/, include: path.resolve(__dirname, 'my-duck'), loader: 'style-loader!css-loader' },
      { test: /\.js[x]?$/, include: path.resolve(__dirname, 'my-duck'), exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new CopyWebpackPlugin([
      { from: './my-duck/index.html', to: 'index.html' },
      { from: './my-duck/main.css', to: 'main.css' }
    ]),
  ]
};
