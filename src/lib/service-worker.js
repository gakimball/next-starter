const path = require('path');
const { Router } = require('express');
const url = require('url');

/**
 * Express middleware to serve the script that loads the service worker. The script sits in
 * `/.next/service-worker.js`, so it's outside of the `static/` folder where you would normally
 * load static assets from. So, we overload this one request to serve up the script correctly.
 * @private
 * @param {Object} app - Next.js app instance.
 * @returns {Object} Express router.
 */
module.exports = (app) => {
  const router = new Router();

  router.get('/service-worker.js', (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const filePath = path.join(__dirname, '../', app.nextConfig.distDir, parsedUrl.pathname);

    app.serveStatic(req, res, filePath);
  });

  return router;
};
