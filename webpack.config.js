const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const deepAssign = require('deep-assign');
const cmsListModuleName = 'NormalList'; //暴露给外部的模块名称
const rollListModuleName = 'RollList';

const commonConfig = {
  // 引用外部 jQuery
  externals: {
    'jquery': 'window.jQuery'
  },
  resolve: {
    alias: {
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

let cmsListConfig = {
  entry: './src/cms_list.js',
  output: {
    filename: 'cms-list.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: [cmsListModuleName]
  }
};
cmsListConfig = deepAssign(cmsListConfig, commonConfig);

let rollListConfig = {
  entry: './src/roll_list.js',
  output: {
    filename: 'roll-list.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: [rollListModuleName]
  }
};
rollListConfig = deepAssign(rollListConfig, commonConfig);

module.exports = [cmsListConfig, rollListConfig];
