const ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * Next.js plugin to apply a Sass loader.
 * @param {Object} [nextConfig={}] - Next.js config to decorate.
 */
const withSass = (nextConfig = {}) => Object.assign({}, nextConfig, {
  webpack: (config) => {
    const extractCSSPlugin = new ExtractTextPlugin({
      filename: 'static/style.css',
    });

    config.module.rules.push({
      test: /(\.scss|\.css)$/,
      exclude: /node_modules.*\.css$/,
      use: [
        'classnames-loader',
        ...extractCSSPlugin.extract([
          'css-loader',
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
        ]),
      ],
    });

    config.plugins.push(extractCSSPlugin);

    return config;
  },
});

module.exports = (nextConfig = {}) => withSass(nextConfig);
