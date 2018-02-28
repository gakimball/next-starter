# Next.js Starter

Proof-of-concept that layers the feature's of Ueno's [starter kit](https://github.com/ueno-llc/starter-kit-universally) on top of [Next.js](https://github.com/zeit/next.js).

Includes all the things you get from Next out of the box, including:

- Server-side rendering
- Universal Webpack
- Babel
- Hot reloading
- Code splitting
- Static site export

Also includes more helpful things on top:

- Express with good security defaults
- Sass and CSS Modules
- MobX
- react-helmet
- Central project config
- Service workers

Critically, all the moving parts are contained inside a small handful of modules and scripts. This means the complexity of the build system is hidden away, and a project is more easily upgradeable, because the guts of the framework aren't in the main codebase, where they'd be checked into version control.

## File Structure

This is the bare minimum you need for the boilerplate to work:

```
- pages
  - index.js
- server
  - index.js
next.config.js
package.json
```

## Modules


### Next Config

Configures Next.js with all the bells and whistles of the starter kit, including:

- Sass, PostCSS, and CSS Modules
- SVG-to-JSX loader
- Offline mode via service worker

In `next.config.js`:

```js
const withUeno = require('@ueno/starter-kit/next-config');

module.exports = withUeno();
```

To add your own settings, pass them in as an object to the config function.

### Server

Starts a preconfigured Express sever with Next.

```js
import server from '@ueno/starter-kit/server';

server();
```

You can tack on extra things to the server before it starts.

```js
import server from '@ueno/starter-kit/server';
import bodyParser from 'body-parser';

server(app => {
  app.use(bodyParser);
  return app;
});
```

### Document

To change the wrapper HTML around a React app, Next.js allows you to define a file `/pages/_document.js`. This starter kit includes a pre-made document that adds necessary stuff like CSS, helmet, config values, and so on.

```js
import Document from '@ueno/starter-kit/document';

export default Document;
```

### Provider

To make MobX work, we have to wrap each page in our app with a store provider. You can't do that in `_document.js` because that HTML is all static. So instead, we do it on each page individually.

First, we make some stores and use the starter kit's `provider()` function:

```js
import provider from '@ueno/starter-kit/provider';
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

# License

MIT &copy; [Geoff Kimball](http://geoffkimball.com)
