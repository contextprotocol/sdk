import { TDomain } from "../../domains/types";
import { TTimestamps } from "../../types";
import { TVersion } from "../../versions/type";
import { Document } from "../Document";

export type TDocument = TTimestamps & {
  _id: string;
  topDocument: string;
  path: string;
  pathHash: string;
  domainId: TDomain;
  isTemplate: boolean;
  versionNumber: string;
  version: TVersion;
};

export type TDocumentFilter = {
  offset?: number;
  limit?: number;
  name?: string;
  domain?: string;
  template?: boolean;
};

export type TAllDocumentsResponse = {
  documents: TDocument[] | Document[];
  total: number;
  limit: number;
  offset: number;
};

export type TCreateDocument = {
  path: string;
  pathHash?: string;
  isTemplate?: boolean;
};

export type TCreateVersion = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  templates?: string[];
};

export type TCreateDocumentWithVersion = {
  document: TCreateDocument;
  version: TCreateVersion;
};
