/* eslint-disable react/no-danger */

const React = require('react');
const PropTypes = require('prop-types');

/**
 * React component to create an inline script. When the script is created, it's contents are hashed,
 * and the hash is added to the server response's Content Security Policy. This allows us to
 * safely insert inline scripts into the page.
 *
 * The hash function referenced here is created by the `cspHeaderHash()` function.
 *
 * @private
 */
module.exports = (hash) => {
  class InlineScript extends React.Component {

    render() {
      const { body } = this.props;

      return (
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: hash(body) }}
        />
      );
    }
  }

  /**
   * Prop types for `<InlineScript />`.
   * @prop {String} body - Contents of script.
   */
  InlineScript.propTypes = {
    body: PropTypes.string.isRequired,
  };

  return InlineScript;
};
