# A Crash Course on Next.js

## What is Next?

[Next.js](https://nextjs.org) is a framework for making React apps. Here are some of the fancy things Next does out of the box, with no configuration:

- Server-side rendering
- Hot reloading
- Routing
- Code-splitting by route

## Adding Pages

To create a page, add a `.js` file with a React component to the `pages/` folder.

```js
// pages/index.js

import React from 'react';

export default () => <p>Homepage!</p>;
```

If a page needs to load data asynchronously, you can add a static function called `getInitialProps()`. It should return an object, which will be added as props to the component.

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

  render() {
    const { page } = this.props;

    return (
      <h1>{page.data.title}</h1>
    );
  }
}
```

## Linking Between Pages

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

## Static Assets

Your project has a `/static` folder, which is where images, fonts, etc. go. Reference them like normal HTML; don't use `require()` or `import`.

```html
<img src="/static/logo.svg" />
```

If you want to load an SVG as JSX, you can `require()` or `import` it.
