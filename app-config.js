module.exports = {
  csp: {
    scriptSrc: ["'self'", "'unsafe-inline'"],
  },
  helmet: {
    meta: [
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    ],
  },
};
