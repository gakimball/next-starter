# Advanced Routing

If you need support for parameterized routes, like `/blog/:id`, you can use the library [next-routes](https://www.npmjs.com/package/next-routes), which is included in the starter kit.

To enable it, create a routes file. You can put it anywhere, but `routes/index.js` makes it easy to find.

```js
const routes = require('next-routes')();

routes
  .add('blog-post', '/blog/:id');

module.exports = routes;
```

Now, in your [app config file](/configuration) (`app-config.js`), add the property `ueno.routes` and include the router:


```js
const routes = require('./routes');

module.exports = {
  ueno: {
    routes,
  },
};
```

With the above example, the path `/blog/:id` will load the page at `pages/blog-post.js`. In the `getInitialProps` for the page, you can access the route parameters like so:

```js
import React from 'react';

export default class BlogPost extends React.Component {
  static async getInitialProps({ query }) {
    return {
      postId: query.id,
    };
  }
}
```

## Changes to linking and routing

Normally, to create links or change pages, you'd use Next's `<Link>` and `<Router>` components. When using next-routes, you'll instead import `Link` and `Router` modules from your routes file.

```js
import React from 'react';
import { Link, Router } from '../routes';

export default class Page extends React.Component {
  render() {
    return (
      <div>
        <Link route="/post/1">Go to Post ID 1</Link>
        <a onClick={() => Router.pushRoute('/post/2')}>Go to Post ID 2</a>
      </div>
    );
  }
}
```

If you want to set up router events (e.g. `onRouteChangeComplete`), you'll still use Next's built-in `Router` module.
