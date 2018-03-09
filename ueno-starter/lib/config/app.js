/* eslint-disable import/no-dynamic-require */
/* global __non_webpack_require__ */

const path = require('path');
const withUeno = require('./next');

module.exports = () => {
  let appConfig;

  // Try to load a user config if it exists
  // A user-defined Next.js config is automatically decorated with the starter kit plugins
  try {
    // @TODO Watch app-config and reload
    const configPath = path.relative(__dirname, path.join(process.cwd(), 'app-config.js'));

    // @TODO When this is converted into an actual library, it won't be bundled with Webpack and
    // this won't be necessary
    appConfig = __non_webpack_require__(configPath);
  } catch (err) {
    appConfig = {};
  }

  return withUeno(appConfig);
};
