import React, { Component } from 'react';

export default class Planet extends Component {

  static async getInitialProps({ query }) {
    return {
      slug: query.slug,
    };
  }

  render() {
    const { slug } = this.props;

    console.log(slug);

    return (
      <h1>{slug}</h1>
    );
  }
}
