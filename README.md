# Next.js Starter

Proof-of-concept that layers the feature's of Ueno's [starter kit](https://github.com/ueno-llc/starter-kit-universally) on top of [Next.js](https://github.com/zeit/next.js).

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

### Store

To add MobX stores, first assemble all of your store classes in one place like this:

```js
import store from '@ueno/starter/store';
import PlanetsStore from './planets-store';
import KittensStore from './kittens-store';

export default store({
  planets: PlanetsStore,
  kittens: KittensStore,
});
```

The above function creates a decorator function. Now, create the file `pages/_app.js` if you don't already have one, and decorate the `<App />` component.

```js
import stores from './stores';

@stores
export default class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    return {
      pageProps: Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {},
    };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}
```

If you want to do some MobX stuff before a page renders, you can reference any MobX store in the `getInitialProps()` method of a page.

```js
import React, { Component } from 'react';

export default class Index extends Component {
  static async getInitialProps({ mobxStores }) {
    await mobxStores.planets.fetch();
  }

  render() {
    // ...
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
- `PASSWORD_PROTECT`: gate all server access with a login form. Use `username:password` to set a username/password combo.

# License

MIT &copy; [Geoff Kimball](http://geoffkimball.com)
