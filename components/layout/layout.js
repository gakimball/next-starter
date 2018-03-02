import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import getConfig from 'next/config';

const { publicRuntimeConfig: config } = getConfig();

const Layout = ({ title, children }) => (
  <div>
    <Helmet {...config.helmet} title={title} />
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
