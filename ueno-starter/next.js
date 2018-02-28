const ExtractTextPlugin = require('extract-text-webpack-plugin');
const withOffline = require('next-offline');
const compose = require('compose-function');
const deepAssign = require('deep-assign');
const defaultConfig = require('./lib/default-config');

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
 * Next.js plugin to add an SVG-to-JSX loader.
 * @private
 * @param {Object} [nextConfig={}] - Next.js config to decorate.
 * @returns {Object} Modified Next.hs config.
 */
const withSvgLoader = (nextConfig = {}) => Object.assign({}, nextConfig, {
  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        'babel-loader',
        'svg-to-jsx-loader',
      ],
    });

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options);
    }

    return config;
  },
});

/**
 * Next.js plugin to insert default config values for the starter kit.
 * @private
 * @param {Object} [nextConfig={}] - Next.js config to decorate.
 * @returns {Object} Modified Next.hs config.
 */
const withDefaultConfig = (nextConfig = {}) => deepAssign({}, defaultConfig, nextConfig);

const withUeno = compose(withSvgLoader, withOffline, withSass, withDefaultConfig);

module.exports = (nextConfig = {}) => withUeno(nextConfig);
