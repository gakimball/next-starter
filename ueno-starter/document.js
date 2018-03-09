/* eslint-disable react/no-danger, jsx-a11y/html-has-lang */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import NextDocument, { Head, Main, NextScript } from 'next/document';
import getConfig from 'next/config';
import cspHeaderHash from './lib/security/csp-header-hash';
import inlineScript from './lib/security/inline-script';
import { facebookPixel, twitterPixel } from './lib/analytics/scripts';

const { serverRuntimeConfig: config } = getConfig();
const dev = process.env.NODE_ENV !== 'production';

/**
 * React component for use with Next.js's `_document.js` feature. It loads all the extra scripts,
 * styles, and meta elements used to make the starter kit go.
 */
export default class Document extends NextDocument {

  /**
   * This function runs on the server before the wrapping HTML for the app is rendered. We can
   * access the Express request and response here, among other things.
   * @private
   */
  static async getInitialProps(...args) {
    const documentProps = await super.getInitialProps(...args);
    const { res } = args[0];

    // Create a function we can use to hash inline scripts and add those scripts to the CSP
    const hashingFunction = cspHeaderHash(res);

    return {
      ...documentProps,
      helmet: Helmet.renderStatic(),
      InlineScript: inlineScript(hashingFunction),
      nonce: res.locals.nonce,
    };
  }

  /**
   * Prop types for `<UenoDocument />`.
   * @private
   * @prop {Object} helmet - Helmet configuration.
   * @prop {Function} InlineScript - Component that renders an inline script, hashes its contents,
   * and adds the hash to the CSP of the Express response serving the page.
   * @prop {String} nonce - Randomly-generated string to use as a nonce in inline scripts.
   * Specifically, we use the nonce on Next.js's inline scripts, which we can't hash.
   */
  static propTypes = {
    helmet: PropTypes.object.isRequired,
    InlineScript: PropTypes.func.isRequired,
    nonce: PropTypes.string.isRequired,
  }

  /**
   * Render the wrapping HTML for the React app. This code only executes on the server, and the
   * resulting HTML is totally static. That means it doesn't show up in the React component
   * tree on the client.
   * @returns {Object} JSX.
   */
  render() {
    const { InlineScript, helmet, nonce } = this.props;
    const { htmlAttributes, bodyAttributes, ...headAttributes } = helmet;

    return (
      <html {...htmlAttributes.toComponent()} className="no-js">

        <Head>

          {/* CSS generated by Webpack */}
          {!dev && <link rel="stylesheet" href="/_next/static/style.css" />}

          {/* <head> values from react-helmet */}
          {Object.values(headAttributes).map(attr => attr.toComponent())}

          {/* Script to change `no-js` class to `js` */}
          <InlineScript body='var e=document.documentElement;e.className=e.className.replace("no-js","js")' />

          {/* Scripts to enable social media analytics */}
          {config.facebookPixel && <InlineScript body={facebookPixel(config.facebookPixel)} />}
          {config.twitterPixel && <InlineScript body={twitterPixel(config.twitterPixel)} />}

        </Head>

        <body {...bodyAttributes.toComponent()} className="no-js">

          {/* Facebook tracking for browsers with JavaScript disabled */}
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

          {/* The page is mounted here */}
          <Main />

          {/* polyfill.io, loaded before the main JavaScript */}
          <script src={`${config.polyfillIO.url}?features=${config.polyfillIO.features.join(',')}&flags=gated`} />

          {/* JavaScript bundle for app */}
          <NextScript nonce={nonce} />

        </body>

      </html>
    );
  }
}
