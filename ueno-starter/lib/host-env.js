/**
 * Defaults for two frequently-referenced env vars, `HOST` and `PORT`.
 * @private
 */
module.exports = {
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
};
