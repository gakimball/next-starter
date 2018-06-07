/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';
import getConfig from 'next/config';
import Link from 'next/link';
import Header from 'components/header';
import Layout from 'components/layout';

@inject(stores => ({
  planets: stores.planets.planets.slice(),
}))
export default class Index extends React.Component {

  static async getInitialProps({ mobxStores }) {
    await mobxStores.planets.addPlanet('Not Pluto');
  }

  static propTypes = {
    planets: PropTypes.array,
  }

  static defaultProps = {
    planets: [],
  }

  render() {
    const { planets } = this.props;
    const { publicRuntimeConfig: config } = getConfig();

    return (
      <Layout title="Home!!">
        <Header />
        <p>Nothing feels like ::ffff. Also <Link href="/planets"><a>go here.</a></Link></p>
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
