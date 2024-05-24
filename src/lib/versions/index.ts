import axios from "axios";
import { getHttpHeaders } from "../../utils/getHttpHeader";
import { Config } from "../types";
import { TAllVersionsResponse, TDocumentVersionFilter } from "./type";
import { ContextError } from "../../utils/ContextError";
import { _get } from "../index";

export const getVersions = async (
  path: string,
  queryParams: TDocumentVersionFilter,
  apiKey: string,
  config: Config,
): Promise<TAllVersionsResponse> => {
  const url = `${config.url}/documents/versions/${path}`;
  const response = await _get<TAllVersionsResponse>(url, queryParams, apiKey);

  return {
    versions: response.data.versions,
    total: response.data.total,
  } as TAllVersionsResponse;
};
