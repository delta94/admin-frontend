import React from "react";
import { Switch, Route } from "react-router";
import { useQuery } from "react-apollo-hooks";

import { withStyles, WithStyles } from "@material-ui/styles";

import { styles } from "styles";
import { getAllAccessibleRoutes } from "privateRoutes";
import NotFound404 from "components/404";
import AppBar from "components/AppBar";
import Drawer from "components/Drawer";
import useToggle from "hooks/useToggle";
import SetupWizard from "./pages/SetupWizard/SetupWizard";
import { GET_PROFILE } from "./queries/profile";
import BusyOrErrorCard from "./components/BusyOrErrorCard";
import auth0Client from "auth/Auth";
import { profile } from "queries/__generated__/profile";
import i18n from "i18n";
import LoadingPage from "pages/LoadingPage";
import { Role } from "rbac-rules";
import { useAuth } from "contexts/AuthContext";

function isEmpty(obj: object) {
  return !obj || Object.keys(obj).length === 0;
}

// TODO: We should have the AppBar in a own component. However, that messes up the layout...
// import AppBar from "../components/AppBar";

interface Props extends WithStyles<typeof styles> {}

const PrivateApp: React.FunctionComponent<Props> = ({ classes }) => {
  const { user } = useAuth();
  const { toggler: isDrawerOpen, handleToggler: toggleDrawer } = useToggle(
    false
  );

  const currentUserEmail = user && user.email;

  const { data, error, loading } = useQuery<profile>(GET_PROFILE, {
    variables: { username: currentUserEmail },
    fetchPolicy: "network-only"
  });

  /**
   * Need this hack to "reload", since upon the first request by the user, django has not created yet the user and the profile.
   * So we reload the page after a while, hoping that the user was created...
   */
  if (!loading && data && isEmpty(data)) {
    console.log(data, error);
    /*
    setTimeout(function() {
      window.location.reload();
    }, 1000);
    */
    return <LoadingPage />;
  }

  const hasCompletedSetup = data && data.profile && data.profile.setupCompleted;

  // When we have received the profile data, we can update a few things...
  if (data && data.profile) {
    i18n.changeLanguage(data.profile.language.toLowerCase());
    // Set the dbId of the user. We need this for our nested mutations (even though this should be set by the backend?)
    auth0Client.setDbId(Number(data.profile.id));
  }

  // TODO: Need to actually get the current role from auth0Client. Via a setting to force a rerender?
  const accessibleRoutes = getAllAccessibleRoutes(
    auth0Client.getCurrentRole() || Role.ADMINISTRATOR,
    false
  );

  return (
    <div className={classes.root}>
      <AppBar
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        isDrawerDeactivated={!hasCompletedSetup}
      />
      {!hasCompletedSetup ? null : (
        <Drawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
      )}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        {loading ? (
          <BusyOrErrorCard loading={loading} error={error} />
        ) : !hasCompletedSetup ? (
          data && <SetupWizard profile={data.profile!} />
        ) : (
          <Switch>
            {accessibleRoutes.map((r: any) => (
              <Route
                key={r.path}
                path={r.path}
                exact={r.exact}
                component={r.component}
              />
            ))}
            <Route component={NotFound404} />
          </Switch>
        )}
      </main>
    </div>
  );
};

export default withStyles(styles)(PrivateApp);
