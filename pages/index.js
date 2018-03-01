import React from 'react';
import { inject, PropTypes as MobxPropTypes } from 'mobx-react';
import getConfig from 'next/config';
import Header from '../components/header';
import Layout from '../components/layout';
import withStores from '../stores';
import './index.scss';

const { publicRuntimeConfig: config } = getConfig();

@withStores
@inject(stores => ({
  planets: stores.planets.planets,
}))
export default class Index extends React.Component {

  static propTypes = {
    planets: MobxPropTypes.observableArray.isRequired, // eslint-disable-line react/no-typos
  }

  render() {
    const { planets } = this.props;

    return (
      <Layout title="Home!!">
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
      </Layout>
    );
  }
}
