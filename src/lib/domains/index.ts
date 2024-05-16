import axios from "axios";

import { ContextError, ContextErrorReason } from "../../utils/ContextError";
import { getHttpErrorMessage } from "../../utils/getHttpErrorMessage";
import { getHttpHeaders } from "../../utils/getHttpHeader";
import { Config } from "../types";
import { TAllDomainsResponse, TDomain, TDomainFilter } from "./types";

export const getAllDomains = async (
  fromPublicEndpoint: boolean,
  queryParams: TDomainFilter,
  apiKey: string,
  config: Config,
): Promise<TAllDomainsResponse> => {
  const url = fromPublicEndpoint
    ? `${config.url}/public/domains`
    : `${config.url}/domains`;
  try {
    const response = await axios.get(url, {
      params: queryParams,
      headers: getHttpHeaders(apiKey),
    });
    return {
      domains: response.data.domains,
      total: response.data.total,
      limit: response.data.limit,
      offset: response.data.offset,
    } as TAllDomainsResponse;
  } catch (error) {
    throw new Error(`ContextSDK: ${getHttpErrorMessage(error)}`);
  }
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
  try {
    const response = await axios.get(url, {
      headers: getHttpHeaders(apiKey),
    });
    if (response.status === 403) {
      throw new ContextError(ContextErrorReason.AuthError);
    } else if (response.status === 404) {
      throw new ContextError(ContextErrorReason.DomainNotFound);
    }
    return response.data.domain;
  } catch (error) {
    throw new Error(`ContextSDK: ${getHttpErrorMessage(error)}`);
  }
};
