/* eslint-disable no-underscore-dangle, import/no-dynamic-require */
/* global __UENO_IS_SERVER__ */

const dotProp = require('dot-prop');

let configCache;

module.exports = (path) => {
  if (typeof __UENO_IS_SERVER__ === 'boolean' && __UENO_IS_SERVER__) {
    if (!configCache) {
      const buildConfig = require('./lib/build-config');

      configCache = buildConfig();
    }

    return dotProp.get(configCache, path);
  }

  if (typeof window !== 'undefined') {
    return dotProp.get(window.__UENO_CONFIG__, path);
  }
};
