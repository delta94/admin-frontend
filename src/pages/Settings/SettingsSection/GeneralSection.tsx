import React, { useRef } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import { useTranslation } from "react-i18next";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";

import { Grid, MenuItem } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";

import { styles } from "src/styles";
import { GET_SETTINGS, UPDATE_SETTINGS } from "src/queries/settings";
import auth0Client from "src/auth/Auth";

interface Props extends WithStyles<typeof styles> {
  settings?: any;
  setSettings?: CallableFunction;
  values?: any;
}

function GeneralSection({ classes, values }: Props) {
  const { t } = useTranslation();
  const { data, error, loading } = useQuery(GET_SETTINGS);
  const updateSettings = useMutation(UPDATE_SETTINGS);

  const { settings } = data;
  const roles = auth0Client.getAllowedRoles();

  const handleChange = (name: string) => (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (name === "currentRole") {
      auth0Client.changeCurrentRole(event.target.value);
    } else {
      updateSettings({
        variables: { ...settings, [name]: event.target.value }
      });
    }
  };

  return (
    <Grid item sm={6}>
      <Field
        name="userName"
        label={t("settings:userNameLabel")}
        component={TextField}
        margin="normal"
        fullWidth
      />
      {roles.length ? (
        <Field
          type="text"
          name="currentRole"
          label={t("settings:currentRoleLabel")}
          select
          helperText={t("settings:currentRoleHelperText")}
          margin="normal"
          component={TextField}
          fullWidth
        >
          {roles.map(r => (
            <MenuItem key={r} value={r}>
              {t(r)}
            </MenuItem>
          ))}
        </Field>
      ) : null}
    </Grid>
  );
}

export default withStyles(styles)(GeneralSection);
