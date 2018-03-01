const path = require('path');
const webpack = require('webpack');
const ReloadServerPlugin = require('reload-server-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

/**
 * Create a Webpack compiler for the server. It's not as complicated as the one used for the React
 * app, because all we really want is to transpile Babel.
 * @param {Object} [options] - Compiler options.
 * @param {Boolean} [options.dev=false] Use dev config.
 * @returns {Object} Webpack compiler.
 */
module.exports = ({ dev = false }) => {
  const config = {
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
  };

  if (dev) {
    config.plugins = [
      new ReloadServerPlugin({
        script: path.join(process.cwd(), '.server/index.js'),
      }),
    ];
  }

  const compiler = webpack(config);

  return {
    run: () => new Promise(resolve => compiler.run(resolve)),
    watch: () => compiler.watch({}, () => {}),
  };
};
