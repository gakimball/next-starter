#!/usr/bin/env node

/* eslint-disable no-console */

const dotenv = require('dotenv');
const meow = require('meow');
const execa = require('execa');
const serverCompiler = require('../lib/server-compiler');

dotenv.config();

const cli = meow(`
  Usage:
    $ ueno-starter <command>

  Commands:
    build, dev, export, start
`);

switch (cli.input[0]) {
  // Build production bundles for React app and server
  case 'build': {
    const compiler = serverCompiler({ dev: false });

    Promise.all([
      execa('next', ['build'], { stdio: 'inherit' }),
      compiler.run(),
    ]).then(() => {
      console.log('> Done building.');
    }).catch((err) => {
      console.log('> Error while building.');
      console.log(err);
    });

    break;
  }
  // Run server in dev mode
  case 'dev': {
    const compiler = serverCompiler({ dev: true });

    compiler.watch();

    break;
  }
  // Export to static site
  case 'export': {
    execa('next', ['export'], { stdio: 'inherit' });

    break;
  }
  // Run server in production mode
  case 'start': {
    execa('node', ['./.server/index.js'], {
      stdio: 'inherit',
      env: {
        NODE_ENV: 'production',
      },
    });

    break;
  }
  default:
    cli.showHelp(0);
}
