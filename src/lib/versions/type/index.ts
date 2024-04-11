import { TDocument } from "../../documents/types";
import { TTimestamps } from "../../types";

export type TDocumentVersion = {
  versionNumber: string;
  createdAt: string;
};

export type TAllVersionsResponse = {
  versions: TDocumentVersion[];
  total: number;
  limit: number;
  offset: number;
};

export type TDocumentVersionFilter = {
  offset?: number;
  limit?: number;
};

export type TVersion = TTimestamps & {
  _id: string;
  documentId: string | TDocument;
  prevVersionId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  templates: string[] | TVersion[];
  txId: string;
  major: number;
  minor: number;
  patch: number;
  versionNumber: string;
};
