# Ueno + Next

## A Crash Course on Next.js

### What is Next?

[Next.js](https://nextjs.org) is a framework for making React apps. Here are some of the fancy things Next does out of the box, with no configuration:

- Server-side rendering
- Hot reloading
- Routing
- Code-splitting by route

### Adding Pages

To create a page, add a `.js` file with a React component to the `pages/` folder.

```js
// pages/index.js

import React from 'react';

export default () => <p>Homepage!</p>;
```

If a page needs to load data asynchronously, you can use a class-based component and add a static function called `getInitialProps()`. It should return an object, which will be added as props to the component.

Here's an example that fetches a page from Prismic:

```js
import React from 'react';
import Prismic from 'prismic-javascript';

export default class Index extends React.Component {
  static async getInitialProps({ req }) {
    const api = await Prismic.getApi('https://ueno.prismic.io/api/v2', { req });

    return {
      page: await api.getSingle('home_page'),
    };
  }
}
```

### Linking Between Pages

To link between pages, use Next's `<Link />` component.

```js
import Link from 'next/link';

const link = <Link href="/about">About</Link>;
```

To change the page programmatically, use Next's `Router` module.

```js
import Router from 'next/router';

Router.push('/about');
```

### Static Assets

Your project has a `/static` folder, which is where images, fonts, etc. go. Reference them like normal HTML; don't use `require()` or `import`.

If you want to load an SVG as JSX, you can `require()` or `import` it.

## Working Client-Side

### Sass

The starter kit uses Sass, compiled to PostCSS, compiled to CSS, converted to CSS Modules.

```scss
.button {
  // ...
}
```

```js
import React from 'react';
import s from './Button.scss';

export default ({ children, onClick }) => (
  <button className={s.button} type="button" onClick={onClick}>
    {children}
  </button>
);
```

You can also call `s` as a function to make use of the [classnames](https://npmjs.org/package/classnames) library.

### MobX

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

## Working Server-Side

The starter kit includes an Express server with a bunch of helpful middleware installed, including:

- Content Security Policy
- HTTPS enforcement in production (optional)
- Basic Auth (optional)
- Gzip
- Service workers (optional)

To extend the default server, create a file `server/index.js` and add this:

```js
import server from '@ueno/starter-kit/server';
import graphql from 'express-graphql';

server(app => {
  // app is the Express server
  app.use(graphql());
});
```

You can add new middleware or routes inside the callback. Calling `server()` is also what starts the server.

Whenever you make changes to the server, it will automatically restart.

## Configuration

To tweak the starter kit, add a file called `app-config.js` at the root of your project that exports an object.

Next has some [configuration options](https://nextjs.org/docs#custom-configuration) that you can add here. There's also some specific to this starter kit.

- `baseUrl`: base URL for the app. By default, this combines the `HOST` and `PORT` environment variables, or uses the `BASE_URL` environment variable if it exists.
- `csp`: extend the Content Security Policy. Each key should be a CSP category, and each value should be an array of things to whitelist.
- `enforceHttps`: redirect HTTP requests to HTTPS. If `true`, this is only enabled in production.
- `facebookPixel`: account ID for Facebook analytics.
- `gaId`: account ID for Google Analytics.
- `helmet`: react-helmet configuration.
- `notifier`: display errors or other logging info as OS notifications.
- `polyfillIO`: enables loading of browser polyfills through polyfill.io. Set to `null` to turn off.
  - `polyfillIO.url`: URL to fetch. Defaults to `//cdn.polyfill.io/v2/polyfill.min.js`.
  - `polyfillIO.features`: JavaScript features to polyfill. Defaults to `['default', 'es6']`.
- `remoteDevtools`: enable grid/MobX dev tools in production.
- `serviceWorker`: enables offline support through service workers.
- `twitterPixel`: account ID for Twitter analytics.

### Environment variables

Some configuration is stored in super secret environment variables.

- `BASE_URL`: base URL for the app.
- `HOST`: hostname for the app.
- `PASSWORD_PROTECT`: enable Basic Auth for all requests. The format of this variable is either `password` or `username:password`.
- `PORT`: port to listen on.
