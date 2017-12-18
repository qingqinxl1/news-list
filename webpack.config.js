const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const moduleName = 'List'; //暴露给外部的模块名称

module.exports = {
  entry: {
    cms_demo_js: [
      './src/js/main.js'
    ],
    cms_list_css: [
      './src/css/list.css'
    ],
    roll_demo_js: [
      './src/js/roll_main.js'
    ],
    //只有cms方式的分页
    cms_list_js: [
      './src/js/cms_list.js'
    ],
    //只有roll接口分页方法
    roll_list_js: [
      './src/js/roll_list.js'
    ],
    //支持cms分页和roll接口分页
    list: [
      './index.js'
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: [moduleName]
  },
  // 引用外部 jQuery
  externals: {
    'jquery': 'window.jQuery'
  },
  resolve: {
    alias:{
      'art-template$': 'art-template/lib/template-web'
    }
  },
  module: {
    rules: [{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            query: {
              sourceMap: true,
              minimize: true
            }
          }]
        }),
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [{
          loader: 'file-loader',
          query: {
            publicPath: './',
            name: '[name].[ext]'
          }
        }],
        exclude: /node_modules/,
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    // new CleanWebpackPlugin('./dist'),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true,
    }),
    new webpack.BannerPlugin({
      banner: 'date:' + new Date() + ', hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]',
    }),
    new UglifyJSPlugin({
      uglifyOptions: {
        ie8: true,
        compress: {
          drop_console: true
        },
        output: {
          ascii_only: true,
        },
        mangle: false
      }
    })
  ]
};
