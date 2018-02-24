const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const withOffline = require('next-offline');

/**
 * Next.js plugin to apply a Sass loader.
 * @private
 * @param {Object} [nextConfig={}] - Next.js config to decorate.
 * @returns {Object} Modified Next.js config.
 */
const withSass = (nextConfig = {}) => Object.assign({}, nextConfig, {
  webpack: (config, options) => {
    const { dev } = options;

    const extractCSSPlugin = new ExtractTextPlugin({
      filename: 'static/style.css',
    });

    config.module.rules.push({
      test: /(\.scss|\.css)$/,
      exclude: /node_modules.*\.css$/,
      use: [
        'classnames-loader',
        ...extractCSSPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: 1,
                importLoaders: 1,
                localIdentName: dev ? '[name]_[local]_[hash:base64:5]' : '[hash:base64:10]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  require('autoprefixer'),
                  require('postcss-csso')({ restructure: false }),
                ],
              },
            },
            'sass-loader',
          ],
        }),
      ],
    });

    config.plugins.push(extractCSSPlugin);

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options);
    }

    return config;
  },
});

/**
 * Next.js plugin to define a global that indicates what environment the code is in.
 * @private
 * @param {Object} [nextConfig={}] - Next.js config to decorate.
 * @returns {Object} Modified Next.js config.
 */
const withServerFlag = (nextConfig = {}) => Object.assign({}, nextConfig, {
  webpack(config, options) {
    const { isServer } = options;

    config.plugins.push(new webpack.DefinePlugin({
      __UENO_IS_SERVER__: JSON.stringify(isServer),
    }));

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options);
    }

    return config;
  },
});

module.exports = (nextConfig = {}) => withOffline(withServerFlag(withSass(nextConfig)));
