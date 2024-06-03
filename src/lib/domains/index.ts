import { Config } from "../types";
import { TAllDomainsResponse, TDomain, TDomainFilter } from "./types";
import { _get } from "../index";

export const getAllDomains = async (
  fromPublicEndpoint: boolean,
  queryParams: TDomainFilter,
  apiKey: string,
  config: Config,
): Promise<TAllDomainsResponse> => {
  const url = fromPublicEndpoint
    ? `${config.url}/public/domains`
    : `${config.url}/domains`;
  const response = await _get<TAllDomainsResponse>(url, queryParams, apiKey);

  return {
    domains: response.data.domains,
    total: response.data.total,
    limit: response.data.limit,
    offset: response.data.offset,
  } as TAllDomainsResponse;
};

export const getDomain = async (
  fromPublicEndpoint: boolean,
  name: string,
  apiKey: string,
  config: Config,
): Promise<TDomain> => {
  const url = fromPublicEndpoint
    ? `${config.url}/public/domains/${name}`
    : `${config.url}/domains/${name}`;
  const response = await _get<{ domain: TDomain }>(url, {}, apiKey);
  return response.data.domain;
};
