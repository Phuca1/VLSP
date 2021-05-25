import React from 'react';
import { useSelector } from 'react-redux';
import routes from '../../constants/routes';

import User from '../user';

const Home = ({ history }) => {
  const { user } = useSelector((state) => ({ ...state.auth }));

  if (user.role === 'manager') {
    history.push(routes.USER_MANAGEMENT);
  }

  if (user.role === 'admin') {
    history.push(routes.ADMIN_HOME);
  }

  return <User />;
};

export default Home;
