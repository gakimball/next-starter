import React from 'react';
import { inject, PropTypes as MobxPropTypes } from 'mobx-react';
import getConfig from 'next/config';
import Header from '../components/header';
import withStores from '../stores';
import './index.scss';

const { publicRuntimeConfig: config } = getConfig();

const Index = ({ planets = [] }) => (
  <div>
    <Header />
    <p>Nothing feels like ::ffff</p>
    <p>{config.host}:{config.port}</p>
    <ul>
      {planets.map(planet => (
        <li key={planet}>
          {planet}
        </li>
      ))}
    </ul>
  </div>
);

Index.propTypes = {
  planets: MobxPropTypes.observableArray.isRequired, // eslint-disable-line react/no-typos
};

const injector = stores => ({
  planets: stores.planets.planets,
});

export default withStores(inject(injector)(Index));
