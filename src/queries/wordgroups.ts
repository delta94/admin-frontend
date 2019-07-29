import gql from "graphql-tag";

export const WORDGROUP_FRAGMENT = gql`
  fragment WordgroupParts on api_wordgroup {
    parentChapterId: fk_chapter_id
    id
    titleCh: title_ch
    titleDe: title_de
    words {
      id
      word {
        id
        translations {
          audio
          exampleSentence: example_sentence
          language {
            code
            name
          }
          text
          id
        }
      }
    }
  }
`;

export const GET_WORDGROUPS = gql`
  subscription subscribeWordGroups {
    wordGroups: api_wordgroup {
      ...WordgroupParts
    }
  }
  ${WORDGROUP_FRAGMENT}
`;

export const GET_WORDGROUP_BY_ID = gql`
  subscription subscribeWordGroupById($id: uuid!) {
    wordGroup: api_wordgroup_by_pk(id: $id) {
      ...WordgroupParts
    }
  }
  ${WORDGROUP_FRAGMENT}
`;

export const INSERT_WORDGROUP = gql`
  mutation insertWordGroup($input: [api_wordgroup_insert_input!]!) {
    insert_api_wordgroup(objects: $input) {
      returning {
        id
        parentChapterId: fk_chapter_id
        titleCh: title_ch
        titleDe: title_de
      }
    }
  }
`;

export const UPDATE_WORDGROUP = gql`
  mutation updateWordGroup($id: uuid, $input: api_wordgroup_set_input!) {
    update_api_wordgroup(where: { id: { _eq: $id } }, _set: $input) {
      returning {
        id
        titleCh: title_ch
        titleDe: title_de
      }
    }
  }
`;

export const UPSERT_WORDGROUP = gql`
  mutation upsertWordGroup($input: [api_wordgroup_insert_input!]!) {
    insert_api_wordgroup(objects: $input) {
      returning {
        id
        parentChapterId: fk_chapter_id
        titleCh: title_ch
        titleDe: title_de
      }
    }
  }
`;

/**
 * See here why we are "updating" (--> actually not, just using it since otherwise the nested upsert would fail..) the ID column:
 * https://docs.hasura.io/1.0/graphql/manual/mutations/upsert.html
 */
export const UPSERT_WORD = gql`
  mutation upsertWord(
    $wordId: uuid!
    $input: api_wordtranslation_insert_input!
  ) {
    insert_api_word(
      on_conflict: { constraint: api_word_pkey, update_columns: [id] }
      objects: [{ id: $wordId, translations: { data: [$input] } }]
    ) {
      returning {
        id
      }
    }
  }
`;
