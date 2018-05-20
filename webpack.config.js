const webpack = require('webpack');
const path = require('path');
const os = require('os');

const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OfflinePlugin = require('offline-plugin');

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
    //new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin([buildPath]),
    new CopyWebpackPlugin([
      {from: imgPath + '/logo.ico', to: buildPath + '/logo.ico'},
      {from: jsSourcePath + '/manifest.json', to: buildPath + '/manifest.json'}
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'assets/js/vendor-[hash].js',
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
      filename: name + '.html'
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
    })
  ];

  // Common rules
  const rules = [
    {
      test: /\.(js|jsx)$/,
      include: [
        path.resolve(__dirname, './frontend'),
        path.resolve(__dirname, './node_modules/url-regex'),
        path.resolve(__dirname, './node_modules/react-proptypes-url-validator')
      ],
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: path.join(__dirname, './tmp/cache/webpack')
        }
      }
    },
    {
      test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      loader: 'file-loader?name=assets/fonts/[name].[ext]'
    },
    {
      test: /\.(png|gif|jpg|svg)$/,
      // include: imgPath,
      loader: 'file-loader?name=assets/img/[name].[ext]'
    }
  ];

  const extractVendorsCss = new ExtractTextPlugin('style-vendors-[hash].css');
  const extractCss = new ExtractTextPlugin('style-[hash].css');
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
        parallel: {
          cache: path.join(__dirname, './tmp/cache/webpack/uglify'),
          workers: 4
        },
        output: {
          comments: false,
        }
      }),
      extractVendorsCss,
      extractCss
    );

    rules.push(
      {
        test: /\.css$/,
        use: extractVendorsCss.extract({
          use: [
            {
              loader: 'cache-loader',
              options: {
                cacheDirectory: path.join(__dirname, '../../tmp/cache/webpack/css')
              }
            },
            'css-loader?minimize',
            'postcss-loader'
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.less$/,
        include: globalLessPath,
        use: extractCss.extract({
          use: [
            {
              loader: 'cache-loader',
              options: {
                cacheDirectory: path.join(__dirname, '../../tmp/cache/webpack/less')
              }
            },
            'css-loader?minimize',
            'postcss-loader',
            'less-loader'
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.less$/,
        exclude: globalLessPath,
        use: extractCss.extract({
          use: [
            {
              loader: 'cache-loader',
              options: {
                cacheDirectory: path.join(__dirname, '../../tmp/cache/webpack/less-global')
              }
            },
            'css-loader?modules,minimize,localIdentName="[hash:base64:6]"',
            'postcss-loader',
            'less-loader'
          ],
          fallback: 'style-loader'
        })
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
      {
        test: /\.css$/,
        loader: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.join(__dirname, '../../tmp/cache/webpack/dev-css')
            }
          },
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        include: globalLessPath,
        loader: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.join(__dirname, '../../tmp/cache/webpack/dev-less')
            }
          },
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.less$/,
        exclude: globalLessPath,
        loader: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.join(__dirname, '../../tmp/cache/webpack/dev-less-global')
            }
          },
          'style-loader',
          'css-loader?modules&importLoaders=1'
            + '&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
          'less-loader'
        ]
      }
    );
  }

  if (isProduction && name === 'index') {
    plugins.push(new OfflinePlugin({
      ServiceWorker: {
        events: true
      },
      AppCache: {
        events: true
      }
    }));
  }

  return {
    name: name,
    devtool: isProduction ? false : 'source-map',
    context: jsSourcePath,
    entry: {
      js: [entryName + '.js'],
    },
    output: {
      path: buildPath,
      publicPath: '/',
      filename: `assets/js/${outputName}-[hash].js`,
    },
    module: {
      rules,
    },
    resolve: {
      extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js'],
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
      host: '0.0.0.0'
    }
  };
}

// module.exports = createWebpackConfig('index', './admin', 'admin');
// module.exports = createWebpackConfig('index', './app', 'app');

module.exports = [
  createWebpackConfig('index', './app', 'app'),
  createWebpackConfig('admin', './admin', 'admin')
];
