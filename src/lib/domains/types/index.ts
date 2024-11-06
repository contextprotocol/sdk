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
  fullDomain: string;
  tld: string;
  status: DomainStatus;
  owner: any;
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
