#!/usr/bin/env node

/* eslint-disable no-console */

const dotenv = require('dotenv');
const meow = require('meow');
const execa = require('execa');
const ngrok = require('ngrok');
const serverCompiler = require('../lib/server-compiler');
const hostEnv = require('../lib/host-env');

dotenv.config();

const cli = meow(`
  Usage:
    $ ueno-starter <command>
    $ ueno-starter help <command>

  Commands:
    build, dev, export, start

  Run "ueno-starter help <command>" to get info on a specific command.
`, {
  description: 'Ueno Starter Kit',
  flags: {
    remote: {
      type: 'boolean',
      alias: 'r',
    },
  },
});

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

    if (cli.flags.remote) {
      ngrok.connect(hostEnv.PORT, (err, url) => {
        if (err) {
          throw err;
        }

        process.env.REMOTE_URL = url;

        compiler.watch();
      });
    } else {
      compiler.watch();
    }

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
  // Display info about a specific command
  case 'help': {
    const command = cli.input[1];

    const helpText = {
      build: 'Build your app for production. Run this before deploying to a server.',
      dev: 'Run your app in development mode.',
      export: 'Export your app as a static site.',
      help: 'Get info on a command.',
      start: 'Run your app in production mode.',
    };

    if (!command) {
      console.log('Run "ueno-starter help <command>" to get info on a specific command.');
    } else if (command in helpText) {
      console.log(`  Usage:\n    $ ueno-starter ${command}\n\n  ${helpText[command]}`);
    } else {
      cli.showHelp(0);
    }

    break;
  }
  default:
    cli.showHelp(0);
}
