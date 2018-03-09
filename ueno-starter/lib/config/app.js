const withUeno = require('./next');

module.exports = () => {
  let appConfig;

  // Try to load a user config if it exists
  // A user-defined Next.js config is automatically decorated with the starter kit plugins
  try {
    // @TODO This won't work when this is changed into a real library
    // @TODO Watch app-config and reload
    appConfig = require('../../app-config'); // eslint-disable-line import/no-unresolved
  } catch (err) {
    appConfig = {};
  }

  return withUeno(appConfig);
};
