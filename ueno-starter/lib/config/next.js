/**
 * This is where all the client-side magic of the starter kit happens. The functions below modify
 * the default behavior of Next.js to add fancy new features. Each feature should be its own
 * function.
 */

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const withOffline = require('next-offline');
const compose = require('compose-function');
const deepAssign = require('deep-assign');
const pick = require('lodash/pick');
const omit = require('lodash/omit');
const defaultConfig = require('./defaults');

/**
 * Next.js plugin to apply a Sass loader, with PostCSS, CSS modules, and classnames.
 * @private
 * @param {Object} [nextConfig={}] - Next.js config to decorate.
 * @returns {Object} Modified Next.js config.
 */
const withSass = (nextConfig = {}) => ({
  ...nextConfig,
  webpack: (config, options) => {
    const { dev, isServer } = options;

    // Plugin to create final CSS file in production
    const extractCSSPlugin = new ExtractTextPlugin({
      filename: 'static/style.css',
    });

    // Core loaders used in every situation
    const cssLoaders = [
      {
        loader: isServer && dev ? 'css-loader/locals' : 'css-loader',
        options: {
          modules: 1,
          minimize: !dev,
          sourceMap: dev,
          importLoaders: 1,
          localIdentName: dev ? '[name]_[local]_[hash:base64:5]' : '[hash:base64:10]',
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          config: {
            path: path.join(__dirname, './postcss.config.js'),
          },
          plugins: () => [
            require('autoprefixer'),
            require('postcss-csso')({ restructure: false }),
          ],
          sourceMap: dev,
        },
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: dev,
        },
      },
    ];

    // Loader sequence used in development
    // On the client we also need style-loader after the default set
    const devLoaders = isServer ? cssLoaders : ['style-loader', ...cssLoaders];

    config.module.rules.push({
      test: /(\.scss|\.css)$/,
      exclude: /node_modules.*\.css$/,
      use: [
        'classnames-loader',
        // In development, each CSS module is embedded as a separate <link> tag, so they can be
        // separately hot reloaded. In production, all the CSS is bundled into one file.
        ...(dev ? devLoaders : extractCSSPlugin.extract({
          fallback: 'style-loader',
          use: cssLoaders,
        })),
      ],
    });

    // In production we need this plugin to output the final CSS file
    if (!dev) {
      config.plugins.push(extractCSSPlugin);
    }

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
const withSvgLoader = (nextConfig = {}) => ({
  ...nextConfig,
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
 * Next.js plugin to insert default config values for the starter kit. Next.js allows config values
 * to be defined in two buckets: public and server. One is visible to client and server, and one is
 * visible to server only.
 *
 * Our starter kit puts values in both buckets to make things work. However, to simplify things
 * for the user, they define all their config values in one object, and we sort them into the two
 * buckets automatically. That way the user doesn't have to remember which of our config values
 * go where.
 *
 * @private
 * @param {Object} [nextConfig={}] - Next.js config to decorate.
 * @returns {Object} Modified Next.hs config.
 */
const withDefaultConfig = (nextConfig = {}) => {
  if (!nextConfig.ueno) {
    return deepAssign({}, defaultConfig, nextConfig);
  }

  // Copy the user-provided config values into the correct spots
  const serverConfigValues = Object.keys(defaultConfig.serverRuntimeConfig);
  const publicConfigValues = Object.keys(defaultConfig.publicRuntimeConfig);
  const runtimeConfig = {
    serverRuntimeConfig: pick(omit(nextConfig.ueno, ['routes']), serverConfigValues),
    publicRuntimeConfig: pick(nextConfig.ueno, publicConfigValues),
  };
  const config = deepAssign({}, defaultConfig, runtimeConfig, nextConfig);

  // @TODO Find a more elegant way to insert this value--it can't be deep merged
  config.serverRuntimeConfig.routes = nextConfig.ueno.routes;

  return config;
};

/**
 * Next.js plugin to enable offline support via service workers. This plugin only functions when
 * the app is built for production.
 * @private
 * @param {Object} [nextConfig={}] - Next.js config to decorate.
 * @returns {Object} Modified Next.hs config.
 */
const withServiceWorker = (nextConfig = {}) => {
  // Only add the plugin if it's been enabled
  if (nextConfig.serverRuntimeConfig.serviceWorker) {
    return withOffline(nextConfig);
  }

  return nextConfig;
};

/**
 * Next.js plugin to define the current working directory (which is also the project root) as
 * an import path. This allows us to write absolute import paths and not messs around with `../..`.
 * @private
 * @param {Object} [nextConfig={}] - Next.js config to decorate.
 * @returns {Object} Modified Next.hs config.
 */
const withRootImport = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    config.resolve.modules.push('./');

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options);
    }

    return config;
  },
});

/**
 * Next.js plugin to modify the friendly errors plugin used by Next.js. We modify it by passing
 * `clearConsole: false` to the plugin, which prevents it from wiping the console on every
 * re-compile. We do this because the starter kit runs two webpack bundles that both use this
 * plugin, and if they're both clearing the console then they're interfering with each others'
 * logs.
 * @private
 * @param {Object} [nextConfig={}] - Next.js config to decorate.
 * @returns {Object} Modified Next.hs config.
 */
const withFriendlierErrors = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    const { dev, isServer } = options;

    // Remove the default instance of the plugin
    config.plugins = config.plugins.filter(plugin => !(plugin instanceof FriendlyErrorsPlugin));

    // Re-add it with custom options
    if (dev && !isServer) {
      config.plugins.push(new FriendlyErrorsPlugin({ clearConsole: false }));
    }

    return config;
  },
});

// These functions run in the reverse order of what you see here. The order doesn't really matter,
// other than having `withDefaultConfig` first, because other plugins may reference starter kit
// config values
const withUeno = compose(
  withServiceWorker,
  withSvgLoader,
  withSass,
  withRootImport,
  withFriendlierErrors,
  withDefaultConfig,
);

module.exports = withUeno;
