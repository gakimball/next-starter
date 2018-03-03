/* eslint-disable react/no-danger */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * React component to create an inline script. When the script is created, it's contents are hashed,
 * and the hash is added to the server response's Content Security Policy. This allows us to
 * safely insert inline scripts into the page.
 *
 * The hash function referenced here is created by the `cspHeaderHash()` function.
 *
 * @private
 */
export default hash => class InlineScript extends Component {

  /**
   * Prop types for `<InlineScript />`.
   * @prop {String} body - Contents of script.
   */
  static propTypes = {
    body: PropTypes.string.isRequired,
  }

  render() {
    const { body } = this.props;

    return (
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{ __html: hash(body) }}
      />
    );
  }
};
