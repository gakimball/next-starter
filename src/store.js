import React, { Component } from 'react';
// eslint-disable-next-line
import { Provider } from 'mobx-react';
import getConfig from 'next/config';
import AnalyticsStore from './lib/analytics/store';

const isServer = typeof window === 'undefined';
const mobxStores = '__NEXT_MOBX_STORE__';

function Store(stores = {}, initialState = {}) {
  // @TODO It's not really a store in the traditional sense, so can it go somewhere else?
  new AnalyticsStore(getConfig().publicRuntimeConfig.gaId); // eslint-disable-line no-new

  // Create each store
  Object.entries(stores).forEach(([name, ChildStore]) => {
    const childStore = new ChildStore();

    // Hydrate each store
    Object.entries(initialState[name] || {}).forEach(([key, value]) => {
      childStore[key] = value;
    });

    this[name] = childStore;
  });
}

/**
 * Get or create a store.
 * @param {Object.<String, Function>} stores - Stores to initialize.
 * @param {Object.<String, Object>} initialState - Initial state to pass to store constructors.
 * @returns {Object} Store.
 * @private
 */
const getStore = (stores = {}, initialState = {}) => {
  // On the server, a new store is always created
  if (isServer) {
    return new Store(stores, initialState);
  }

  // On the client, a store is created and then cached
  if (!window[mobxStores]) {
    window[mobxStores] = new Store(stores, initialState);
  }

  return window[mobxStores];
};

/**
 * Create a decorator from a series of stores which will add a MobX provider to a Next.js `<App />`
 * component.
 * @param {Object.<String, Function>} storeList - Store classes to initialize.
 * @returns Decorator function for a React component.
 */
export default (storeList = {}) => App => class MobX extends Component {

  static async getInitialProps(args) {
    // Create an empty store
    const initialStoreState = getStore(storeList);

    // Place the stores in the Next.js context, so pages can access it
    args.ctx.mobxStores = initialStoreState;

    return {
      ...(
        App.getInitialProps
          ? await App.getInitialProps(args)
          : {}
      ),
      initialStoreState,
    };
  }

  static defaultProps = {
    initialStoreState: {},
  }

  // Hydrate the store with the initial state from `getInitialProps`
  stores = getStore(storeList, this.props.initialStoreState)

  render() {
    return (
      <Provider {...this.stores}>
        <App {...this.props} />
      </Provider>
    );
  }
};
