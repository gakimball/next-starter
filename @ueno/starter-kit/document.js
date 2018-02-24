/* eslint-disable react/no-danger */

import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import serialize from 'serialize-javascript';
import buildConfig from './lib/build-config';

export default class MyDocument extends Document {

  render() {
    return (
      <html lang="en">
        <Head>
          <link rel="stylesheet" href="/_next/static/style.css" />
        </Head>
        <body>
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
