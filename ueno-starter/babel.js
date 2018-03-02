module.exports = {
  presets: [
    'stage-0',
  ],
  plugins: [
    'transform-decorators-legacy',
    ['module-resolver', {
      root: './',
    }],
  ],
};
