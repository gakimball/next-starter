/* eslint-disable react/no-danger, jsx-a11y/html-has-lang */

import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import config from './config';
import buildConfig from './lib/build-config';

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
          <Helmet {...config('helmet')} />
        </Head>
        <body {...bodyAttributes.toComponent()}>
          <Main />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                window.__UENO_CONFIG__ = ${serialize(buildConfig())};
              `,
            }}
          />
          <NextScript />
        </body>
      </html>
    );
  }
}
