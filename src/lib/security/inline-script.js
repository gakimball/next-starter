/* eslint-disable react/no-danger */

const crypto = require('crypto');
const React = require('react');
const PropTypes = require('prop-types');

/**
 * Create a React component that can render an inline script, and add the script to the server's
 * Content Security Policy. When the script is created, it's contents are hashed, and the hash is
 * added to the server response's Content Security Policy. This allows us to safely insert inline
 * scripts into the page.
 *
 * @private
 * @param {Object} response - Express response.
 * @returns {InlineScript} Inline script React component.
 */
module.exports = (response) => {
  /**
   * Modifies the `content-security-policy` header of a response by adding a sha256 hash of the
   * input to the `script-src` directive.
   * @private
   * @param {String} content - Content to hash.
   * @returns {String} Original content.
   */
  const hash = (content) => {
    const sha256 = crypto.createHash('sha256').update(content).digest('base64');

    response.setHeader(
      'content-security-policy',
      (response.getHeader('content-security-policy') || '')
        .split(';')
        .map(directive => directive.includes('script-src')
          ? `${directive} 'sha256-${sha256}'`
          : directive)
        .join(';'),
    );

    return content;
  };

  /**
   * React component to render an inline script with specific string contents.
   * @typedef {Function} InlineScript
   * @private
   */
  const InlineScript = ({ body }) => (
    <script type="text/javascript" dangerouslySetInnerHTML={{ __html: hash(body) }} />
  );

  /**
   * Prop types for `<InlineScript />`.
   * @prop {String} body - Contents of script.
   */
  InlineScript.propTypes = {
    body: PropTypes.string.isRequired,
  };

  return InlineScript;
};
