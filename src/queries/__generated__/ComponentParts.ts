/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ComponentParts
// ====================================================

export interface ComponentParts_type {
  __typename: "api_componenttype";
  id: any;
  name: string;
  icon: string;
}

export interface ComponentParts_texts_translations_language {
  __typename: "api_language";
  id: any;
  code: string;
}

export interface ComponentParts_texts_translations {
  __typename: "api_translation";
  id: any;
  textField: string;
  /**
   * An object relationship
   */
  language: ComponentParts_texts_translations_language;
}

export interface ComponentParts_texts {
  __typename: "api_text";
  id: any;
  /**
   * An array relationship
   */
  translations: ComponentParts_texts_translations[];
}

export interface ComponentParts {
  __typename: "api_component";
  id: any;
  data: string;
  state: string;
  position: number | null;
  /**
   * An object relationship
   */
  type: ComponentParts_type;
  /**
   * An array relationship
   */
  texts: ComponentParts_texts[];
}
