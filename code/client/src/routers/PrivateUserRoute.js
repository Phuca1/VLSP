import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import routes from '../constants/routes';

const PrivateUserRoute = ({ component: Component, ...rest }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => ({
    ...state.auth,
  }));

  return (
    !loading && (
      <Route
        {...rest}
        render={(props) =>
          !isAuthenticated ? (
            <Redirect to={routes.LOGIN} />
          ) : user && user.role === 'user' ? (
            <Component {...props} />
          ) : (
            <Redirect to={routes.HOME} />
          )
        }
      />
    )
  );
};

export default PrivateUserRoute;
