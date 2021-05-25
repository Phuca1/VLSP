import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import routes from '../constants/routes';

const PrivateManagerRoute = ({ component: Component, ...rest }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => ({
    ...state.auth,
  }));

  if (!isAuthenticated && !loading) {
    return <Redirect to={routes.LOGIN} />;
  }

  return (
    !loading && (
      <Route
        {...rest}
        render={(props) =>
          user && user.role === 'manager' ? (
            <Component {...props} />
          ) : (
            <Redirect to={routes.HOME} />
          )
        }
      />
    )
  );
};

export default PrivateManagerRoute;
