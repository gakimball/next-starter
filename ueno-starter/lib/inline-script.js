/* eslint-disable react/no-danger */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default hash => class InlineScript extends Component {

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
