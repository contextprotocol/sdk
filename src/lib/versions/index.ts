import axios from "axios";

import { getHttpErrorMessage } from "../../utils/getHttpErrorMessage";
import { getHttpHeaders } from "../../utils/getHttpHeader";
import { Config } from "../types";
import { TAllVersionsResponse, TDocumentVersionFilter } from "./type";

export const getVersions = async (
  path: string,
  queryParams: TDocumentVersionFilter,
  apiKey: string,
  config: Config,
): Promise<TAllVersionsResponse> => {
  const url = `${config.url}/documents/versions/${path}`;
  try {
    const response = await axios.get(url, {
      params: queryParams,
      headers: getHttpHeaders(apiKey),
    });
    return {
      versions: response.data.versions,
      total: response.data.total,
    } as TAllVersionsResponse;
  } catch (error) {
    throw new Error(`ContextSDK: ${getHttpErrorMessage(error)}`);
  }
};
