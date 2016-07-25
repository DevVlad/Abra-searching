var webpack = require('webpack');
var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    contentBase: './appNew',
    port: 8080
  },
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    path.resolve(__dirname, 'appNew/main.jsx')
  ],
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: './bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss', '.css'],
  },
  module: {
    loaders:[
      {
        test: /(\.scss|\.css)$/,
        include: [/(node_modules\/react-toolbox)/, /(appNew\/)/],
        loader: ExtractTextPlugin.extract('style-loader', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass')
      },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader', exclude: /(react-toolbox)/ },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader', exclude: /(react-toolbox)/ },
      { test: /\.css$/, loader: 'style-loader!css-loader', exclude: /(react-toolbox)/ },
      // { test: /\.css$/, loader: 'style-loader!css-loader' },
      // { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
      { test: /\.gif$/, loader: 'url-loader?mimetype-image/png' },
      { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: 'url-loader?mimetype-application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.js[x]?$/, include: path.resolve(__dirname, 'appNew'), exclude: /node_modules/, loader: 'babel-loader' },
    ]
  },
  postcss: [autoprefixer],
  sassLoader: {
    // data: '@import "' + path.resolve(__dirname, 'theme/_theme.scss') + '";'
    sassLoader: {
    data: '@import "theme/_theme.scss";',
    includePaths: [path.resolve(__dirname, './app')]
  },
  },
  plugins: [
    new ExtractTextPlugin('react-toolbox.css', { allChunks: true }),
    new webpack.HotModuleReplacementPlugin()
    // new OpenBrowserPlugin({ url: 'http://localhost:8080' })
  ],
  devtool: '#inline-source-map'
};
