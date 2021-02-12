

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var webpack = require('webpack');

module.exports = {
  
  entry: './webpack-src/app.js',
  plugins: [
    new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
         $     : 'jquery',
        Popper: ['popper.js', 'default']
    })
  ],
  output: {
    publicPath: '',
    path: path.resolve(__dirname, 'src/dist/'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        //use: ["style-loader", "css-loader"],
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
    ],
  },
};
