const express = require('express');
const next = require('next');
const compression = require('compression');
const url = require('url');
const security = require('./lib/security');
const basicAuth = require('./lib/basic-auth');
const enforceHttps = require('./lib/enforce-https');
const serviceWorker = require('./lib/service-worker');
const { default: getConfig } = require('next/config');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const { serverRuntimeConfig: config } = getConfig();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

/**
 * Create an Express server with security middleware that serves your React app. The server can
 * be customized with extra middleware and routes by passing a callback to the function with
 * one argument, which is the server.
 * @param {Function} [decorate] - Function to modify the server. Takes one parameter, the Express
 * server. Does not need to return a value.
 * @returns {Promise.<Object>} Promise containing the server instance. The Promise resolves once
 * the app has been initialized and the server is listening for requests.
 */
module.exports = (decorate = e => e) => app.prepare().then(() => {
  const server = express();

  // Don't expose any software information to potential hackers.
  server.disable('x-powered-by');

  // Security middlewares.
  server.use(...security(config));

  // Gzip compress the responses.
  // @TODO: Resolve https://github.com/zeit/next.js/issues/3778
  server.use(compression());

  // Enforce HTTPS (turned off by default)
  if (!dev && process.env.ENFORCE_HTTPS) {
    server.use(enforceHttps(host));
  }

  // Require a username and password to see anything (turned off by default)
  if (process.env.PASSWORD_PROTECT) {
    server.use(basicAuth(process.env.PASSWORD_PROTECT));
  }

  // Allow the service worker initialization script to be served
  if (!dev && config.serviceWorker) {
    server.use(serviceWorker(app));
  }

  // This is where we allow the user to customize the server.
  // It comes after all the essential middleware is setup, and before the `*` route that
  // catches every unhandled request.
  decorate(server);

  // All non-API requests go to Next.js
  server.get('*', (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    handle(req, res, parsedUrl);
  });

  server.listen(port, (err) => {
    if (err) {
      throw err;
    }

    console.log(`> Ready on http://${host}:${port}`); // eslint-disable-line no-console
  });

  return server;
});
