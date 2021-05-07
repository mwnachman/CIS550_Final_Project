const { merge } = require('webpack-merge')
const S3Plugin = require('webpack-s3-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new S3Plugin({
      // Only upload css and js
      exclude: /.*\.html$/,
      // s3Options are required
      s3Options: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      s3UploadOptions: {
        Bucket: 'meredithwlatasa.com'
      },
      cloudfrontInvalidateOptions: {
        DistributionId: 'E2FU5PFP2P22LD',
        Items: ['/bundle.*']
      }
    })
  ]
})
