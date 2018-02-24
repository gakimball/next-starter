import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';

const Layout = ({ title, children }) => (
  <div>
    <Helmet title={title} />
    {children}
  </div>
);

Layout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

Layout.defaultProps = {
  children: null,
  title: null,
};

export default Layout;
