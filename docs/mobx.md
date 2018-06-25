# MobX

MobX and friends are sold separately.

```
npm i mobx mobx-react --save
```

To add MobX stores, first assemble all of your store classes in one place like this:

```js
import store from 'next-starter/store';
import PlanetsStore from './planets-store';
import KittensStore from './kittens-store';

export default store({
  planets: PlanetsStore,
  kittens: KittensStore,
});
```

The above code creates a decorator function. Now, create the file `pages/_app.js` if you don't already have one, and decorate the `<App />` component.

```js
import withStores from './stores';

@withStores
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
import { inject } from 'mobx-react';

@inject(stores => ({
  planets: stores.planets.planetList,
}))
export default class Index extends Component {
  static async getInitialProps({ mobxStores }) {
    await mobxStores.planets.fetch();
  }

  render() {
    // ...
  }
}
```
