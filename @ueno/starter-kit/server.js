const express = require('express');
const next = require('next');
const compression = require('compression');
const security = require('./lib/security');
const withUeno = require('./lib/next-config');
const { next: nextConfig } = require('./config');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: withUeno(nextConfig) });
const handle = app.getRequestHandler();

module.exports = (config = e => e) => app.prepare().then(() => {
  const server = config(express());

  // Don't expose any software information to potential hackers.
  server.disable('x-powered-by');

  // Security middlewares.
  server.use(...security);

  // Gzip compress the responses.
  // @TODO: Resolve https://github.com/zeit/next.js/issues/3778
  server.use(compression());

  server.get('*', (req, res) => {
    handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) {
      throw err;
    }

    console.log('> Ready on http://localhost:3000'); // eslint-disable-line no-console
  });

  return server;
});
