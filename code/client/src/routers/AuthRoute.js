import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import routes from '../constants/routes';

const PublicRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useSelector((state) => ({
    ...state.auth,
  }));
  return (
    !loading && (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            <Redirect to={routes.HOME} />
          ) : (
            <Component {...props} />
          )
        }
      />
    )
  );
};

export default PublicRoute;
