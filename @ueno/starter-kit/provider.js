import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'mobx-react';

export default (stores) => {
  let store;

  function StoreContainer(state) {
    Object.entries(stores).forEach(([name, Store]) => {
      this[name] = new Store(state[name]);
    });
  }

  const getStores = (isServer = false, state = {}) => {
    if (isServer && typeof window === 'undefined') {
      return new StoreContainer(state);
    }

    if (!store) {
      store = new StoreContainer(state);
    }

    return store;
  };

  return Target => class Page extends Component {

    static async getInitialProps(ctx) {
      const isServer = !!ctx.req;
      const storeData = {};
      const props = { isServer, storeData };

      if (typeof Target.getInitialProps === 'function') {
        Object.assign(props, await Target.getInitialProps(ctx));
      }

      return props;
    }

    static propTypes = {
      isServer: PropTypes.bool.isRequired,
      storeData: PropTypes.object.isRequired,
    }

    constructor(props) {
      super(props);

      this.stores = getStores(props.isServer, props.storeData);
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
