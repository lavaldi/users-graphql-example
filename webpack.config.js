const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  devtool: "inline-source-map",
  entry: [
    path.join(__dirname, 'example.js')
  ],
  target: "web",  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'example.bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.pug'),
      inject  : true
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.pug$/,
        use:  ['html-loader', 'pug-html-loader?pretty&exports=false']
      }
    ]
  }
};

module.exports = config;