const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/frontend/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/',
    clean: {
      keep: /assets\//  // Keep the assets directory when cleaning
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins: [
      new TsconfigPathsPlugin({ 
        configFile: path.resolve(__dirname, 'tsconfig.json') 
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, "src/backend"),
          path.resolve(__dirname, "tests"),
          /.*\.test\.ts$/,
          /.*\.spec\.ts$/,
          /.*\/__tests__\/.*/
        ],
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.json'),
            onlyCompileBundledFiles: true
          }
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]' // Output images to images/ directory
        }
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/VG.png', // Use VG.png as favicon
    }), 
    new CopyWebpackPlugin({
      patterns: [
        // Copy the logo to multiple locations to ensure it's accessible
        { 
          from: 'public/VG.png',
          to: 'VG.png',
        },
        { 
          from: 'public/VG.png',
          to: 'images/VG.png',
        },
        { 
          from: 'public/VG.png',
          to: 'assets/VG.png',
        },
        { 
          from: 'public/VG.png',
          to: 'public/VG.png',
        },
        { 
          from: 'public/assets',
          to: 'assets',
        },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: process.env.NODE_ENV || 'development',
        REACT_APP_API_URL: process.env.REACT_APP_API_URL || '',
      })
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      watch: true,
    },
    devMiddleware: {
      writeToDisk: true, // Write files to disk in dev mode, so we can see if files are actually created
    },
    historyApiFallback: true, // Important for React Router
    /**
     * CRITICAL PORT CONFIGURATION:
     * Port 8084: Webpack dev server (frontend) - updated from 8082
     * - Backend API server runs on 8083 - updated from 8081
     * - If port 8084 is in use, try 4001 as an alternative
     * - Port 4000 is reserved for legacy testing
     * 
     * IMPORTANT: Keep this in sync with src/config/index.ts
     */
    port: 8084,
    hot: true,
    open: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:8083',
        pathRewrite: { '^/api': '' },
        secure: false,
        changeOrigin: true,
      },
      {
        // Add proxy rule for GraphQL endpoint
        context: ['/graphql'], 
        target: 'http://localhost:8083', // Backend GraphQL server
        secure: false, 
        changeOrigin: true, 
        // No pathRewrite needed as /graphql matches backend
      }
    ],
  },
  devtool: 'eval-source-map', // Good for development
};