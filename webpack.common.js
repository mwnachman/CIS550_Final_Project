/* global process:false */
const webpack = require('webpack')
const path = require('path')
const devMode = process.env.NODE_ENV !== 'production'


module.exports = {
  entry: [
    './src/index.js'
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
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, './build/' + process.env.NODE_ENV),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
}
