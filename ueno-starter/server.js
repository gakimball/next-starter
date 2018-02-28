const path = require('path');
const express = require('express');
const next = require('next');
const compression = require('compression');
const url = require('url');
const security = require('./lib/security');
const basicAuth = require('./lib/basic-auth');
const { default: getConfig } = require('next/config');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const { serverRuntimeConfig: config } = getConfig();

module.exports = (decorate = e => e) => app.prepare().then(() => {
  const server = decorate(express());

  // Don't expose any software information to potential hackers.
  server.disable('x-powered-by');

  // Security middlewares.
  server.use(...security);

  // Gzip compress the responses.
  // @TODO: Resolve https://github.com/zeit/next.js/issues/3778
  server.use(compression());

  if (config.passwordProtect) {
    server.use(basicAuth(config.passwordProtect));
  }

  server.get('*', (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname === '/service-worker.js') {
      const filePath = path.join(__dirname, '.next', pathname);

      app.serveStatic(req, res, filePath);
    } else {
      handle(req, res, parsedUrl);
    }
  });

  server.listen(3000, (err) => {
    if (err) {
      throw err;
    }

    console.log('> Ready on http://localhost:3000'); // eslint-disable-line no-console
  });

  return server;
});
