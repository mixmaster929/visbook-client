const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src-react/index.js', // Adjust if your plugin's entry file is located elsewhere
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'visbook-app.js', // Keep as is since you're already using this name
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // To handle both .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // Convert images < 8kb to base64 strings
              name: 'images/[name].[hash:8].[ext]' // Output images to images folder
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'visbook-app.css', // No change needed here
    }),
  ],
};
