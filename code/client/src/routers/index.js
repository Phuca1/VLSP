import React from 'react';

import { Redirect, Switch } from 'react-router-dom';

import appRoutes from './appRoutes';
import PrivateManagerRoute from './PrivateManagerRoute';
import PrivateRoute from './PrivateRoute';
import PrivateUserRoute from './PrivateUserRoute';
import AuthRoute from './AuthRoute';
import routes from '../constants/routes';
import PrivateAdminRoute from './PrivateAdminRoute';

const Router = (props) => {
  return (
    <Switch>
      {appRoutes.map(
        ({ path, exact = true, component: Component, access, ...rest }) => {
          if (access === 'auth') {
            return (
              <AuthRoute
                key={path}
                exact
                path={path}
                component={Component}
                {...rest}
              />
            );
          }
          if (access === 'admin') {
            return (
              <PrivateAdminRoute
                key={path}
                exact
                path={path}
                component={Component}
                {...rest}
              />
            );
          }
          if (access === 'user') {
            return (
              <PrivateUserRoute
                key={path}
                exact
                path={path}
                component={Component}
                {...rest}
              />
            );
          }
          if (access === 'manager') {
            return (
              <PrivateManagerRoute
                key={path}
                exact
                path={path}
                component={Component}
                {...rest}
              />
            );
          }
          if (access === 'private') {
            return (
              <PrivateRoute
                key={path}
                exact
                path={path}
                component={Component}
                {...rest}
              />
            );
          }
          return <Redirect to={routes.HOME} />;
        },
      )}
    </Switch>
  );
};

export default Router;
