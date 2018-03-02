/* eslint-disable react/no-danger, jsx-a11y/html-has-lang */

import React from 'react';
import Helmet from 'react-helmet';
import Document, { Head, Main, NextScript } from 'next/document';
import getConfig from 'next/config';
import cspHeaderHash from './lib/csp-header-hash';
import inlineScript from './lib/inline-script';
import { facebookPixel, twitterPixel } from './lib/analytics';

const { serverRuntimeConfig: config } = getConfig();

export default class MyDocument extends Document {

  static async getInitialProps(...args) {
    const documentProps = await super.getInitialProps(...args);
    const { res } = args[0];
    const hashingFunction = cspHeaderHash(res);

    return {
      ...documentProps,
      InlineScript: inlineScript(hashingFunction),
      helmet: Helmet.renderStatic(),
      nonce: res.locals.nonce,
    };
  }

  render() {
    const { InlineScript, helmet, nonce } = this.props;
    const { htmlAttributes, bodyAttributes, ...headAttributes } = helmet;

    return (
      <html {...htmlAttributes.toComponent()}>
        <Head>
          <link rel="stylesheet" href="/_next/static/style.css" />
          {Object.values(headAttributes).map(attr => attr.toComponent())}
          <Helmet {...config.helmet} />
          <InlineScript body='var e=document.documentElement;e.className=e.className.replace("no-js","js")' />
          {config.facebookPixel && <InlineScript body={facebookPixel(config.facebookPixel)} />}
          {config.twitterPixel && <InlineScript body={twitterPixel(config.twitterPixel)} />}
        </Head>
        <body {...bodyAttributes.toComponent()} className="no-js">
          {config.facebookPixel && (
            <noscript>
              <img
                src={`https://www.facebook.com/tr?id=${config.facebookPixel}&ev=PageView&noscript=1`}
                style={{ display: 'none' }}
                alt=""
                height="1"
                width="1"
              />
            </noscript>
          )}
          <Main />
          <script src={`${config.polyfillIO.url}?features=${config.polyfillIO.features.join(',')}&flags=gated`} />
          <NextScript nonce={nonce} />
        </body>
      </html>
    );
  }
}
