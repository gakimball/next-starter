/* eslint-disable react/no-danger, jsx-a11y/html-has-lang */

import React from 'react';
import Helmet from 'react-helmet';
import Document, { Head, Main, NextScript } from 'next/document';
import getConfig from 'next/config';

const { serverRuntimeConfig: config } = getConfig();

export default class MyDocument extends Document {

  static async getInitialProps(...args) {
    const documentProps = await super.getInitialProps(...args);

    return {
      ...documentProps,
      helmet: Helmet.renderStatic(),
    };
  }

  render() {
    const { helmet } = this.props;
    const { htmlAttributes, bodyAttributes, ...headAttributes } = helmet;

    return (
      <html {...htmlAttributes.toComponent()}>
        <Head>
          <link rel="stylesheet" href="/_next/static/style.css" />
          {Object.values(headAttributes).map(attr => attr.toComponent())}
          <Helmet {...config.helmet} />
        </Head>
        <body {...bodyAttributes.toComponent()}>
          <Main />
          <script src={`${config.polyfillIO.url}?features=${config.polyfillIO.features.join(',')}&flags=gated`} />
          <NextScript />
        </body>
      </html>
    );
  }
}
