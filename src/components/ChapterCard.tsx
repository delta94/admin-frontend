import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { withStyles, WithStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Paper";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";

import { styles } from "src/styles";
import { chapters_chapters } from "src/queries/__generated__/chapters";
import {
  chapterById_chapter,
  chapterById_chapter_subChapters
} from "src/queries/__generated__/chapterById";

interface Props extends WithStyles<typeof styles> {
  chapter:
    | chapters_chapters
    | chapterById_chapter
    | chapterById_chapter_subChapters;
}

const ChapterCard = ({ classes, chapter }: Props) => {
  const { t } = useTranslation();

  // Note: MUI links together with react-router-dom and Typescript are a bit tricky due to their dynamic nature
  // See the discussion and provided solutions here... https://github.com/mui-org/material-ui/issues/7877
  // <Button component={Link} {...{ to: "/about" } as any} />
  const isSubChapter = !!chapter.parentChapter;
  const path = isSubChapter
    ? `/chapters/${chapter.parentChapter && chapter.parentChapter.id}/${
        chapter.id
      }`
    : `/chapters/${chapter.id}`;
  return (
    <Card>
      <CardActionArea component={RouterLink} {...{ to: path } as any}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {t("chapter:chapter")} {chapter.title}
          </Typography>
          <Typography variant="h5" component="h2">
            {chapter.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default withStyles(styles, { withTheme: true })(ChapterCard);
