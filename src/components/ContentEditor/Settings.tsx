import * as React from "react";
import { FormikActions, Formik } from "formik";

import { Theme, makeStyles } from "@material-ui/core/styles";
import { Grid, Drawer, Button } from "@material-ui/core";

import Text from "components/Text";
import { Settings as SettingsIcon, Save as SaveIcon } from "@material-ui/icons";
import { BaseSettings, BaseSettingsProps } from "./BaseComponent";
import { TitleSettings } from "./components/TitleComponent";
import { TextSettings } from "./components/TextComponent";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  GET_SELECTED_COMPONENT,
  GET_LOCAL_SELECTED_COMPONENT_ID,
  UPDATE_COMPONENT
} from "queries/component";
import { getSelectedComponentId } from "queries/__generated__/getSelectedComponentId";
import { getSelectedComponent } from "queries/__generated__/getSelectedComponent";

// This defines a mapping of component setting type names to the React Component, used then to render the content and the settings
export const settingTypes: { [key: string]: any } = {
  default: BaseSettings,
  Title: TitleSettings,
  Text: TextSettings
};

interface SettingsContentProps extends BaseSettingsProps {
  type: string;
}

/**
 * "Dynamic" component type mapping component
 */
const SettingsContent = React.forwardRef<any, SettingsContentProps>(
  (props, ref) => {
    const { data, type, ...otherProps } = props;
    const Component = settingTypes[type] || settingTypes.default;
    return <Component ref={ref} data={data} {...otherProps} />;
  }
);

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    backgroundColor: theme.palette.grey[400]
  },
  container: {
    padding: theme.spacing(5),
    backgroundColor: theme.palette.grey[400]
  }
}));

/**
 * The main Settings Component.
 * Consists of a header with generic, component type agnostic functionality and a "dynamic" settings content implementation depending on the component type
 */
const Settings = () => {
  const classes = useStyles();

  const { data: selectedComponentIdData } = useQuery<getSelectedComponentId>(
    GET_LOCAL_SELECTED_COMPONENT_ID
  );
  const { selectedComponentId = undefined } = selectedComponentIdData || {};

  const { data } = useQuery<getSelectedComponent>(GET_SELECTED_COMPONENT, {
    skip: !selectedComponentId
  });
  const { component: selectedComponent = undefined } = data || {};

  const [updateComponent, { loading: updateLoading }] = useMutation(
    UPDATE_COMPONENT
  );

  const handleBackgroundClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const form = React.useRef<Formik>(null);

  const handleOnSaveClick = () => {
    if (!form || !form.current || form.current.handleSubmit(undefined)) {
      console.warn(
        "This component's setting widget is missing a Formik form implementation which handles the validation and submission!"
      );
    } else {
      console.log(form);
      form.current.handleSubmit(undefined);
    }
  };

  /**
   * Will be called from the component implementation
   * TODO(df): Need to discuss, what should be the "interface":
   *  -  Do we pass the mutation from each component?
   *  -  Do we pass a defined list of entities, such as the settings data, texts?
   * @param settingsData
   * @param texts
   */
  const handleOnSubmit = (settingsData: string, texts?: any[]) => {
    console.log(settingsData, texts);
    // TODO(df): How do we handle translatable texts? Should also be inserted/updated here!
    updateComponent({
      variables: {
        id: selectedComponentId,
        data: {
          // TODO(df): Need to change to JSON type once backend has switched
          data: JSON.stringify(settingsData)
        }
      }
    });
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="bottom"
      open={!!selectedComponent}
      onClick={handleBackgroundClick}
    >
      <Grid container className={classes.container} direction="row">
        <Grid item container xs={12} direction="row" justify="space-between">
          <Grid item container xs={9} direction="row" alignItems="center">
            <SettingsIcon />
            <Text variant="h5">chapterEditor:settingsTitle</Text>
          </Grid>
          <Grid item xs={3} container alignItems="center" justify="flex-end">
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleOnSaveClick}
              disabled={updateLoading}
            >
              <SaveIcon />
              <Text>save</Text>
            </Button>
          </Grid>
        </Grid>
        <Grid xs={12} item container direction="column">
          {selectedComponent ? (
            <SettingsContent
              ref={form}
              type={selectedComponent.type.name}
              data={selectedComponent}
              onSubmit={handleOnSubmit}
            />
          ) : null}
        </Grid>
      </Grid>
    </Drawer>
  );
};

export default Settings;
