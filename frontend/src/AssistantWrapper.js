import React from 'react';
import { useLocation } from 'react-router-dom';
import AssistantComponent from './AssistantComponent';

const AssistantWrapper = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return !isLoginPage && <AssistantComponent />;
};

export default AssistantWrapper;
