const path = require('path');
const os = require('os');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './frontend/index.html',
  filename: 'index.html',
  inject: 'body',
});

const isWin = os.platform() === 'win32';
const globalLessPath = isWin
    ? /frontend\\less/
    : new RegExp(path.join('frontend', 'less'));

module.exports = {
  entry: './frontend/app.jsx',
  output: {
    path: path.resolve('dist'),
    publicPath: '/',
    filename: 'index.js',
  },
  devServer: {
    historyApiFallback: {
      index: '/dist/'
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        include: globalLessPath,
        loader: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.less$/,
        exclude: globalLessPath,
        loader: [
          'style-loader',
          'css-loader?modules&importLoaders=1'
            + '&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          'less-loader',
        ],
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=public/assets/fonts/[name].[ext]',
      },
      {
        test: /\.(jpe?g|gif|png)$/,
        loader: 'file-loader?name=public/assets/img/[name].[ext]',
      },
    ],
  },
  plugins: [
    HtmlWebpackPluginConfig,
  ],
};
