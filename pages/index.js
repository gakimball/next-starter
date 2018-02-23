import React from 'react';
import { inject, PropTypes as MobxPropTypes } from 'mobx-react';
import withStores from '../stores';
import './index.scss';

const Index = ({ planets = [] }) => (
  <div>
    <p>Nothing feels like ::ffff</p>
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
