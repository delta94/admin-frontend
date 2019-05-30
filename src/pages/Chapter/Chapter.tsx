import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "react-apollo-hooks";
import { useTranslation } from "react-i18next";

import { withStyles, WithStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { styles } from "src/styles";
import theme from "src/theme";
import NewChapter from "./NewChapter";
import SubChapterDetail from "./SubChapterDetail";
import { GET_CHAPTER_BY_ID } from "src/queries/chapters";
import {
  chapterById,
  chapterById_chapter_subChapters
} from "src/queries/__generated__/chapterById";
import BusyOrErrorCard from "src/components/BusyOrErrorCard";
import ChapterCard from "src/components/ChapterCard";
import LinkCard from "src/components/LinkCard";
import auth0Client from "src/auth/Auth";
import Section from "src/components/Section";
import SectionCardContainer from "src/components/SectionCardContainer";

// These can come from the router... See the route definitions
interface ChapterRouterProps {
  chapterId: string;
  subChapterId: string;
  componentId: string;
}

interface Props
  extends RouteComponentProps<ChapterRouterProps>,
    WithStyles<typeof styles> {}

/**
 * Main chapter component. Gets the chapter id via the route allowing to create links etc. Conditionally loads either the subchapter or the main chapter
 */
const Chapter = ({ classes, match }: Props) => {
  const { chapterId, subChapterId, componentId } = match.params;
  const { t } = useTranslation();

  // If its a new main chapter, don't need to query anything
  // TODO: This violates React Hook rules!!!!
  if (chapterId === "new") {
    return <NewChapter />;
  }

  // Either load directly the subchapter or else the chapter
  const { loading, data, error } = useQuery<chapterById>(GET_CHAPTER_BY_ID, {
    variables: {
      id: subChapterId && subChapterId !== "new" ? subChapterId : chapterId
    }
  });

  if (!data || !data.chapter || loading || error)
    return (
      <BusyOrErrorCard
        loading={loading}
        error={error}
        noResults={!loading && !!data && !data.chapter}
      />
    );

  // TODO: How do we handle new subchapters?
  if (subChapterId === "new") {
    return <NewChapter parentChapter={data && data.chapter} />;
  }

  // Render the subchapter screen
  if (subChapterId) {
    return (
      <Section title="chapters:chapter" titleTranslatable>
        <SubChapterDetail />
      </Section>
    );
  }

  // Else, then render the chapter overview
  return (
    <Section title={t("chapters:chapter") + ` ${data.chapter.title}`}>
      <SectionCardContainer>
        {data.chapter &&
          data.chapter.subChapters &&
          data.chapter.subChapters.map(
            (c: chapterById_chapter_subChapters | null) => {
              if (!c) return null;
              return (
                <Grid item key={c && c.id}>
                  <ChapterCard chapter={c!} />
                </Grid>
              );
            }
          )}
        {["admin", "content-creator"].includes(
          auth0Client.getCurrentRole() || ""
        ) ? (
          <Grid item>
            <LinkCard
              path={`/chapters/${data.chapter.id}/new`}
              icon={<AddIcon />}
              helperText="createNewSubChapter"
            />
          </Grid>
        ) : null}
      </SectionCardContainer>
    </Section>
  );
};

export default withStyles(styles, { withTheme: true })(Chapter);
