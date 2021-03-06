import gql from "graphql-tag";

export const typeDefs = gql`
  extend type query_root {
    selectedComponentId: uuid!
    currentChapterId: uuid!
    contentEditorLanguage: String!
    contentEditorRole: String!
  }
`;
export const resolvers = {};

/*
import { GET_SETTINGS } from "./settings";

export const typeDefs = gql`
  extend type Query {
    settings: Settings!
  }

  type Settings {
    userName: String
    currentRole: String
    language: String
    translatorLanguages: [String]
    receiveEventNotifications: Boolean
    hasCompletedSetup: Boolean
  }

  extend type Mutation {
    updateSettings(settings: Settings): Settings
  }
`;

export const resolvers = {
  Query: {
    getSettings: (_: any, params: any, { cache }: any) => {
      cache.readQuery({ query: GET_SETTINGS });
    }
  },
  Mutation: {
    updateSettings: (_: any, { settings }: any, { cache }: any) => {
      // TODO: Set current role and set language

      cache.writeQuery({
        query: GET_SETTINGS,
        data: { settings: { ...settings } }
      });
      return settings;
    }
  }
};
*/
