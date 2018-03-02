import React from 'react';
import Logo from '../../static/ueno-logo.svg';
import s from './header.scss';

export default () => (
  <header className={s.header}>
    <Logo />
    <h1>ueno.</h1>
  </header>
);
