# Next.js Starter

Proof-of-concept that layers the features of Ueno's [starter kit](https://github.com/ueno-llc/starter-kit-universally) on top of [Next.js](https://github.com/zeit/next.js).

Includes all the things you get from Next out of the box, including:

- Server-side rendering
- Universal Webpack
- Babel
- Hot reloading
- Code splitting
- Static site export
- Isomorphic project config

Also includes more helpful things on top:

- Express with good security defaults
- Sass and CSS Modules
- MobX
- react-helmet
- Service workers
- Password protection
- Google, Facebook, and Twitter analytics
- Remote development

Critically, all the moving parts are contained inside a small handful of modules and scripts. This means the complexity of the build system is hidden away, and a project is more easily upgradeable, because the guts of the framework aren't in the main codebase, where they'd be checked into version control.

## Table of Contents

- [File Structure](#file-structure)
- [Shell Commands](#shell-commands)
- [Modules](#modules)
  - [Server](#server)
  - [Document](#document)
  - [Provider](#provider)
- [Configuration](#configuration)
- [Table of Contents](#table-of-contents)

## File Structure

This is the bare minimum you need for the boilerplate to work:

```
- pages
  - index.js
package.json
```

## Shell Commands

These commands are wrappers for the Next.js shell commands, with some extra stuff sprinkled in.

- `ueno-starter dev`: run app in development mode.
  - `ueno-starter dev --remote`: run app in development mode, and allow the server to be accessed over the internet.
- `ueno-starter build`: build app for production. Run this before deploying to a server.
- `ueno-starter start`: run app in production mode.
- `ueno-starter export`: export static version of app.

## Modules

### Server

Starts a preconfigured Express sever with Next.

```js
import server from '@ueno/starter/server';

server();
```

You can tack on extra things to the server before it starts.

```js
import server from '@ueno/starter/server';
import bodyParser from 'body-parser';

server(app => {
  app.use(bodyParser);
  return app;
});
```

### Document

To change the wrapper HTML around a React app, Next.js allows you to define a file `/pages/_document.js`. This starter kit includes a pre-made document that adds necessary stuff like CSS, helmet, config values, and so on.

```js
export { Document } from '@ueno/starter/document';
```

### Provider

To make MobX work, we have to wrap each page in our app with a store provider. You can't do that in `_document.js` because that HTML is all static. So instead, we do it on each page individually.

First, we make some stores and use the starter kit's `provider()` function:

```js
import provider from '@ueno/starter/provider';
import UIStore from './ui';
import PlanetsStore from './planets';

export default provider({
  ui: UIStore,
  planets: PlanetsStore,
});
```

Then we import the above file and use it as a decorator:

```js
import React, { Component } from 'react';
import provide from '../stores';

@provide
export default class IndexPage extends Component {
  render() {
    return <div />;
  }
}
```

## Configuration

Configure your project by adding `app-config.js` to the root of your project. It's a module that exports an object. You can include any Next.js options here, or use Next.js plugins.

```js
const withSweetPlugin = require('next-sweet-plugin');

module.exports = withSweetPlugin();
```

### Environment Variables

Place these in a `.env` at your project root to use them.

- `HOST`: hostname for server. Defaults to `localhost`.
- `PORT`: port to serve on. Defaults to `3000`.
- `BASE_URL`: URL of server. Use this to make server requests to the correct host. Defaults to `http://[HOST]:[PORT]`, borrowing from the `HOST` and `PORT` variables.
- `ENFORCE_HTTPS`: redirect all HTTP requests to HTTPS. Defaults to disabled.
- `PASSWORD_PROTECT`: gate all server access with a login form. Use `username:password` (with a colon) to require a username/password combo, or use `password` (without a colon) to just require a password.
- `REMOTE_DEVTOOLS`: enable the display of devtools in production mode. Defaults to disabled.

# License

MIT &copy; [Geoff Kimball](http://geoffkimball.com)
