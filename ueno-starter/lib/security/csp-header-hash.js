const crypto = require('crypto');

/**
 * Create a function which has access to an Express response object.
 * @private
 * @param {Object} response Express response.
 * @returns {HashFunction} Hashing function.
 */
module.exports = response =>
  /**
   * Modifies the `content-security-policy` header of the response by adding a sha256 hash of the
   * input to the `script-src` directive.
   * @private
   * @callback HashFunction
   * @param {String} content - Content to hash.
   * @returns {String} Original content.
   */
  (content) => {
    const sha256 = crypto.createHash('sha256').update(content).digest('base64');

    response.setHeader(
      'content-security-policy',
      (response.getHeader('content-security-policy') || '')
        .split(';')
        .map(directive => directive.includes('script-src')
          ?
          `${directive} 'sha256-${sha256}'`
          :
          directive)
        .join(';'),
    );

    return content;
  };
