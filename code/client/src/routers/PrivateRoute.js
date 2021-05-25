import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import routes from '../constants/routes';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useSelector((state) => ({
    ...state.auth,
  }));
  // console.log(auth);

  return (
    !loading && (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect to={routes.LOGIN} />
          )
        }
      />
    )
  );
};

export default PrivateRoute;
