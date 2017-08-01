const webpack = require('webpack');
const path = require('path');
const os = require('os');

const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const SpritePlugin = require('svg-sprite-loader/plugin');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const jsSourcePath = path.join(__dirname, './frontend');
const buildPath = path.join(__dirname, './public');
const imgPath = path.join(__dirname, './frontend/assets/img');
const iconPath = path.join(__dirname, './source/assets/icons');
const sourcePath = path.join(__dirname, './frontend');

const isWin = os.platform() === 'win32';
const globalLessPath = isWin
    ? /frontend\\less/
    : new RegExp(path.join('frontend', 'less'));

function createWebpackConfig(name, entryName, outputName) {
  // Common plugins
  const plugins = [
    // new UglifyJSPlugin(),
    new CleanWebpackPlugin([buildPath + '/*.js*', buildPath + '/*.css*', buildPath + '/*.html*']),
    //new SpritePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor-[hash].js',
      minChunks(module) {
        const context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(sourcePath, 'index.html'),
      path: buildPath,
      filename: name + '.html',
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer({
            browsers: [
              'last 3 version',
              'ie >= 10',
            ],
          }),
        ],
        context: sourcePath,
      },
    }),
  ];

  // Common rules
  const rules = [
    {
      test: /\.(js|jsx)$/,
      // exclude: /node_modules\/(?!(url-regex|ANOTHER-ONE)\/).*/,
    include: [
        path.resolve(__dirname, './frontend'),
        path.resolve(__dirname, './node_modules/url-regex'),
        path.resolve(__dirname, './node_modules/react-proptypes-url-validator'),
      ],
      use: [
        'babel-loader',
      ],
    },
    // {
    //   test: /\.svg$/,
    //   use: [
    //     {
    //       loader: 'svg-sprite-loader',
    //       options: {
    //         extract: true,
    //         spriteFilename: 'icons-sprite.svg',
    //       },
    //     },
    //     'svgo-loader',
    //   ],
      // include: iconPath,
    //},
    {
      test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      loader: 'file-loader?name=public/assets/fonts/[name].[ext]',
    },
    {
      test: /\.(png|gif|jpg|svg)$/,
      // include: imgPath,
      loader: 'file-loader?name=public/assets/img/[name].[ext]',
    },
  ];

  if (isProduction) {
    // Production plugins
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        },
        output: {
          comments: false,
        }
      }),
      new ExtractTextPlugin('style-[hash].css')
    );

    // Production rules
    rules.push(
      {
        test: /\.(less|css)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!postcss-loader!less-loader',
        }),
      }
    );
  } else {
    // Development plugins
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new DashboardPlugin()
    );

    // Development rules
    rules.push(
      // {
      //   test: /\.(less|css)$/,
      //   // exclude: /node_modules/,
      //   // use: [
      //   //   'style-loader?sourceMap',
      //   //   // Using source maps breaks urls in the CSS loader
      //   //   // https://github.com/webpack/css-loader/issues/232
      //   //   // This comment solves it, but breaks testing from a local network
      //   //   // https://github.com/webpack/css-loader/issues/232#issuecomment-240449998
      //   //   'css-loader?sourceMap',
      //   //   // 'css-loader',
      //   //   'postcss-loader?sourceMap',
      //   //   'less-loader?sourceMap',
      //   // ],
      //   use: [
      //     'style-loader?sourceMap',
      //     // Using source maps breaks urls in the CSS loader
      //     // https://github.com/webpack/css-loader/issues/232
      //     // This comment solves it, but breaks testing from a local network
      //     // https://github.com/webpack/css-loader/issues/232#issuecomment-240449998
      //     'css-loader?sourceMap',
      //     // 'css-loader',
      //     'postcss-loader?sourceMap',
      //     'less-loader?sourceMap',
      //   ],
      // }
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
        }
    );
  }


  return {
    name: name,
    devtool: isProduction ? false : 'source-map',
    context: jsSourcePath,
    entry: {
      js: entryName + '.jsx',
    },
    output: {
      path: buildPath,
      publicPath: '/',
      filename: outputName + '-[hash].js',
    },
    module: {
      rules,
    },
    resolve: {
      extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
      modules: [
        path.resolve(__dirname, 'node_modules'),
        jsSourcePath,
      ],
    },
    plugins,
    devServer: {
      contentBase: isProduction ? buildPath : sourcePath,
      historyApiFallback: true,
      port: 3003,
      compress: isProduction,
      inline: !isProduction,
      hot: !isProduction,
      host: '0.0.0.0',
      stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: false,
        timings: true,
        version: false,
        warnings: true,
        colors: {
          green: '\u001b[32m',
        },
      }
    }
  };
}

//module.exports = createWebpackConfig('index', './admin', 'admin');
//module.exports = createWebpackConfig('index', './app', 'app');

module.exports = [
  createWebpackConfig('index', './app', 'app'),
  createWebpackConfig('admin', './admin', 'admin')
];
