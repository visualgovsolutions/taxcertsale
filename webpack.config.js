const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/frontend/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@frontend': path.resolve(__dirname, 'src/frontend'),
      '@components': path.resolve(__dirname, 'src/frontend/components'),
      '@pages': path.resolve(__dirname, 'src/frontend/pages'),
      '@styles': path.resolve(__dirname, 'src/frontend/styles'),
      '@hooks': path.resolve(__dirname, 'src/frontend/hooks'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: 'public',
          to: 'public',
          globOptions: {
            ignore: ['**/index.html'], // We don't need to copy index.html as HtmlWebpackPlugin already uses it
          },
        },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: true, // Important for React Router
    port: 3000,
    hot: true,
    open: true,
  },
  devtool: 'eval-source-map', // Good for development
}; 