import * as React from "react";

import {withStyles, WithStyles} from "@material-ui/core/styles";
import {useQuery} from "react-apollo-hooks";
import {RouteComponentProps} from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";

import {styles} from "styles";
import NewWordGroup from "./NewWordGroup";
import {GET_WORDGROUP_BY_ID} from "queries/wordgroups";
import BusyOrErrorCard from "components/BusyOrErrorCard";
import {wordGroup_wordGroup, wordGroup_wordGroup_words} from "../../queries/__generated__/wordGroup";
import {convertGlobalToDbId} from "../../helpers";
import {useTranslation} from "react-i18next";
import Section from "../../components/Section";
import SectionCardContainer from "../../components/SectionCardContainer";
import {Grid} from "@material-ui/core";
import WordCard from "../../components/WordCard";
import auth0Client from "../../auth/Auth";
import LinkCard from "../../components/LinkCard";
import {wordGroupById_wordGroup} from "../../queries/__generated__/wordGroupById";

// These can come from the router... See the route definitions
interface WordGroupRouterProps {
  id: string;
}

interface Props
  extends RouteComponentProps<WordGroupRouterProps>,
    WithStyles<typeof styles> {
}

const WordGroup = ({classes, match}: Props) => {
  const {t} = useTranslation();

  const {loading, data, error} = useQuery<wordGroupById_wordGroup>(GET_WORDGROUP_BY_ID, {
    variables: {
      id: convertGlobalToDbId(match.params.id)
    },
    skip: match.params.id === "new"
  });

  if (match.params.id === "new") {
    return <NewWordGroup/>;
  }

  let title_name = ` ${data && data.titleDe ? data.titleDe : ''} / ${data && data.titleCh ? data.titleCh : ''}`;

  return <Section
    title={t("wordGroups:wordGroup") + ` ${title_name}`}>
    <SectionCardContainer>
      <BusyOrErrorCard
        loading={loading}
        error={error}
        noResults={!loading && data && !!data.words && !data.words.length}
      />
      {data &&
      data.words &&
      data.words.map((w: wordGroup_wordGroup_words | null) => (
        w ?
          <Grid item key={w.id}>
            <WordCard word={w}/>
          </Grid> : null
      ))}
      {["admin"].includes(auth0Client.getCurrentRole() || "") ? (
        <Grid item>
          <LinkCard
            path="/wordgroups/new"
            icon={<AddIcon/>}
            helperText="wordGroups:createNewWordGroup"
          />
        </Grid>
      ) : null}
    </SectionCardContainer>
  </Section>
};

export default withStyles(styles, {withTheme: true})(WordGroup);
