import React from "react";
import { Route, Router, Switch } from "react-router-dom";

import auth0Client from "./auth/Auth";
import Callback from "./components/Callback";
import history from "./myHistory";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import PrivateApp from "./PrivateApp";

const handleAuthentication = (props: any) => {
  if (/access_token|id_token|error/.test(props.location.hash)) {
    auth0Client.handleAuthentication();
  }
};

const Routes: React.FunctionComponent = props => (
  <Router history={history}>
    <Switch>
      <Route
        path="/login"
        render={props => {
          return <LandingPage {...props} />;
        }}
      />
      <Route
        exact
        path="/auth-callback"
        render={props => {
          handleAuthentication(props);
          return <Callback {...props} />;
        }}
      />
      <PrivateRoute path="/" {...props} component={PrivateApp} />
    </Switch>
  </Router>
);

export default Routes;
