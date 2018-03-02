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

module.exports = (decorate = e => e) => app.prepare().then(() => {
  const server = decorate(express());

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
    console.log('Using this!');
    server.use(serviceWorker(app));
  }

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
