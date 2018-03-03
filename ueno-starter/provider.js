import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'mobx-react';
import getConfig from 'next/config';
import AnalyticsStore from './lib/analytics-store';

const { publicRuntimeConfig: config } = getConfig();

/**
 * Create a decorator that adds MobX support to your page. If you're using MobX, you'll want to
 * use this decorator on every page component.
 * @param {Object.<String, Function>} stores - Stores to provide.
 * @returns {ProviderFunction} Decorator function.
 */
export default (stores) => {
  let store;

  /**
   * Wrapper class to hold all stores. Initial state can be passed to the wrapper constructor,
   * and store-specific state will be passed to each store constructor.
   * @name StoreContainer
   * @private
   * @constructor
   */
  function StoreContainer() {
    this.analytics = new AnalyticsStore(config.gaId);

    Object.entries(stores).forEach(([name, Store]) => {
      this[name] = new Store();
    });
  }

  /**
   * Get a store container. On the server, a new container is returned each time. On the client,
   * the first time a container is fetched, a new one will be created and cached. On subsequent
   * requests, the cached container will be used. This is because we want to persist the store
   * between page transitions.
   * @private
   * @param {Boolean} [isServer=false] - Server is asking for a store container.
   * @returns {StoreContainer} Store container.
   */
  const getStores = (isServer = false) => {
    if (isServer && typeof window === 'undefined') {
      return new StoreContainer();
    }

    if (!store) {
      store = new StoreContainer();
    }

    return store;
  };

  /**
   * Decorate a component to add MobX support.
   * @callback ProviderFunction
   * @param {Function} Target - Component to decorate.
   * @returns {Function} Decorated component.
   */
  return Target => class Page extends Component {

    static async getInitialProps(ctx) {
      const isServer = !!ctx.req;
      const props = { isServer };

      if (typeof Target.getInitialProps === 'function') {
        Object.assign(props, await Target.getInitialProps(ctx));
      }

      return props;
    }

    static propTypes = {
      isServer: PropTypes.bool.isRequired,
    }

    constructor(props) {
      super(props);

      this.stores = getStores(props.isServer);
    }

    render() {
      return (
        <Provider {...this.stores}>
          <Target {...this.props} />
        </Provider>
      );
    }
  };
};
