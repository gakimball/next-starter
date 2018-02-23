const ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * Next.js plugin to apply a Sass loader.
 * @param {Object} [nextConfig={}] - Next.js config to decorate.
 */
const withSass = (nextConfig = {}) => Object.assign({}, nextConfig, {
  webpack: (config, { dev, isServer }) => {
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

    return config;
  },
});

module.exports = (nextConfig = {}) => withSass(nextConfig);
