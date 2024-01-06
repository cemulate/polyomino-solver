const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    app: './app.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
          },
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset/inline',
      },
      {
        test: /\.worker\.js$/,
        loader: 'worker-loader',
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './wasm/z3w.wasm', to: './z3w.wasm' },
        { from: './wasm/z3w.js', to: './z3w.js' },
        { from: './index.html', to: './index.html' },
        { from: './assets/favicon.png', to: './favicon.png' },
      ],
    }),
  ],
};
