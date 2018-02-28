#!/usr/bin/env node

const path = require('path');
const webpack = require('webpack');
const ReloadServerPlugin = require('reload-server-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const dotenv = require('dotenv');

dotenv.config();

// Run a simple webpack setup to compile the server. Mostly we're interested in using Babel on
// the server, so we don't need anything fancy like CSS support.
const compiler = webpack({
  context: process.cwd(),
  entry: './server/index.js',
  output: {
    filename: 'index.js',
    path: path.join(process.cwd(), '.server'),
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                targets: {
                  node: 'current',
                },
              }],
            ],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: [path.join(process.cwd(), 'server'), 'node_modules'],
  },
  plugins: [
    new webpack.DefinePlugin({
      __UENO_IS_SERVER__: JSON.stringify(true),
    }),
    new webpack.IgnorePlugin(/path\.join/),
    new ReloadServerPlugin({
      script: path.join(process.cwd(), '.server/index.js'),
    }),
  ],
});

compiler.watch({}, () => {});
