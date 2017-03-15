const path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './frontend/app/index.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  entry: './frontend/app/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'index-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=public/fonts/[name].[ext]'
      }
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig
  ]
}