import { TTimestamps } from "../../types";
import { Domain } from "../Domain";

export enum DomainStatus {
  Temporary = "temporary",
  Registered = "registered",
  Verified = "verified",
}

export type TDomain = TTimestamps & {
  _id: string;
  userId: string;
  name: string;
  nameHash: string;
  status: DomainStatus;
  owner: string;
  documents: [];
  editor?: string;
};

export type TDomainFilter = {
  offset?: number;
  limit?: number;
};

export type TAllDomainsResponse = {
  domains: TDomain[] | Domain[];
  total: number;
  limit: number;
  offset: number;
};
