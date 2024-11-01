import React from 'react';
import { useLocation } from 'react-router-dom';
import HeaderComponent from './HeaderComponent';

const HeaderWrapper = ({ user }) => {
  const location = useLocation();
  return location.pathname !== '/login' ? <HeaderComponent user={user} /> : null;
};

export default HeaderWrapper;
