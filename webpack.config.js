const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './frontend/app/index.html',
  filename: 'index.html',
  inject: 'body',
});

module.exports = {
  entry: './frontend/app/index.jsx',
  output: {
    path: path.resolve('dist'),
    filename: 'index-bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        include: new RegExp(['frontend', 'app', 'less/'].join(path.sep)),
        loader: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.less$/,
        exclude: new RegExp(['frontend', 'app', 'less/'].join(path.sep)),
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
