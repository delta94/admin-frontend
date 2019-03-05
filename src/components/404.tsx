import * as React from "react";

import { withStyles, WithStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import LoginIcon from "@material-ui/icons/AccountCircle";
import Avatar from "@material-ui/core/Avatar";

import { styles } from "../styles";
import theme from "../theme";

interface Props extends WithStyles<typeof styles> {}

const NotFound404 = ({ classes }: Props) => (
  <div className={classes.container}>
    <Card className={classes.card}>
      <CardContent>
        <div className={classes.logoContainer}>
          <Avatar
            alt="Vochabular Logo"
            src={process.env.PUBLIC_URL + "/logo.svg"}
            className={classes.landingLogo}
          />
        </div>
        <Typography variant="h1">404</Typography>
        <Typography variant="subtitle1">Nicht gefunden</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="large" color="primary">
          <LoginIcon style={{ marginRight: theme.spacing.unit }} />
          Zurück zum Dashboard
        </Button>
      </CardActions>
    </Card>
  </div>
);

export default withStyles(styles, { withTheme: true })(NotFound404);
