/* global process:false */
const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const devMode = process.env.NODE_ENV !== 'production'


module.exports = {
  entry: [
    './client/src/index.js',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/react'],
            plugins: [
              ['@babel/plugin-proposal-class-properties', {'loose': true}],
              ['@babel/plugin-proposal-object-rest-spread', { 'loose': true, 'useBuiltIns': true }]
            ]
          }
        }
      },
      {
        test: /\.(css)$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './build/' + process.env.NODE_ENV,
    historyApiFallback: true,
    clientLogLevel: 'error'
  },
  output: {
    path: path.resolve(__dirname, 'build/' + process.env.NODE_ENV),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  node: {
    fs: 'empty',
    net: 'empty'
  }
}
