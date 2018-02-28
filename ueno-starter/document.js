/* eslint-disable react/no-danger, jsx-a11y/html-has-lang */

import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import Helmet from 'react-helmet';

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
          <Helmet />
        </Head>
        <body {...bodyAttributes.toComponent()}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
