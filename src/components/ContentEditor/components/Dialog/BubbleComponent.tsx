import * as React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { TextField } from "formik-material-ui";

import { makeStyles } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core/styles";

import BaseComponent, {
  BaseComponentProps,
  BaseSettingsProps
} from "../../BaseComponent";

/**
 * Validation Schema definition of the input fields of this component
 */
const BubbleSchema = Yup.object().shape({
  link: Yup.string(),
  languageCode: Yup.string(),
});

export interface BubbleSettingsProps extends BaseSettingsProps {}

/**
 * Setting widget's dynamic component view
 */
export const BubbleSettings = React.forwardRef<any, BubbleSettingsProps>(
  (props, ref) => {
    const { onSubmit } = props;
    const { t } = useTranslation();

    return (
      <Formik
        initialValues={{}}
        validationSchema={BubbleSchema}
        onSubmit={values => onSubmit({})}
      >
        {props => (
          <Form>
            <Field
              type="string"
              name="introduction"
              label={t("editor:Text")}
              helperText={t("editor:TextHelper")}
              component={TextField}
              margin="normal"
              fullWidth
            />
          </Form>
        )}
      </Formik>
    );
  }
);

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    border: "dashed",
    borderRadius: 2
  }
}));

export interface BubbleComponentProps extends BaseComponentProps {}

/**
 * How the component should get rendered in the editor
 */
const BubbleComponent = ({ data, ...otherProps }: BubbleComponentProps) => {
  console.log(data)
  const classes = useStyles();
  const preview = <div className={classes.container}></div>;

  return <BaseComponent preview={preview} data={data} {...otherProps} />;
};

export default BubbleComponent;