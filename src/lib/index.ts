import { FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import axios, { AxiosError, AxiosResponse } from "axios";

import { Config } from "./types";
import { getHttpHeaders } from "../utils/getHttpHeader";
import { ContextError, ContextErrorResponse } from "../utils/ContextError";
import { TDocument } from "./documents/types";
import { TMetadata, TVersion } from "./versions/type";

export { getAllDocuments, getDocument, createDocument } from "./documents";
export { getAllDomains, getDomain } from "./domains";

export interface Success<T> {
  success: true;
  data: T;
}

export interface Failure {
  success: false;
  error: ContextErrorResponse;
}

export type Result<T> = Success<T> | Failure;
export type ContextResult<T> = Promise<Result<T>>;

export const uploadAsset = async (
  path: string,
  filePath: string,
  metadata: TMetadata | undefined,
  apiKey: string,
  config: Config,
): Promise<{ asset: { document: TDocument; version: TVersion } }> => {
  const url = `${config.url}/assets`;

  const formData = new FormData();
  formData.append("file", await fileFromPath(filePath));
  formData.append("body", JSON.stringify({ path, metadata }));

  const response = await _post<{
    asset: { document: TDocument; version: TVersion };
  }>(url, formData, apiKey);
  return response.data;
};
export async function _get<T>(
  url: string,
  queryParams: any,
  apiKey: string,
): Promise<AxiosResponse<T, any>> {
  try {
    return await axios.get(url, {
      params: queryParams,
      headers: getHttpHeaders(apiKey),
    });
  } catch (err) {
    throw _handleError(err as AxiosError);
  }
}

export async function _post<T>(
  url: string,
  param: any,
  apiKey: string,
): Promise<AxiosResponse<T, any>> {
  try {
    return await axios.post(url, param, {
      headers: getHttpHeaders(apiKey),
    });
  } catch (err) {
    throw _handleError(err as AxiosError);
  }
}
export async function _patch<T>(
  url: string,
  data: any,
  apiKey: string,
): Promise<AxiosResponse<T, any>> {
  try {
    return await axios.patch(url, data, {
      headers: getHttpHeaders(apiKey),
    });
  } catch (err) {
    throw _handleError(err as AxiosError);
  }
}

function _handleError(error: AxiosError) {
  if (error.code === "ECONNREFUSED") {
    return new ContextError({
      message: "Connection refused",
    });
  }
  if (error.response && error.response.status && error.response.status >= 400) {
    const data = error?.response?.data;
    const err = data
      ? (data as { message: string; error?: string; statusCode?: number })
      : { message: "Internal server error" };

    return new ContextError(err);
  } else {
    return new ContextError({ message: error.message as string });
  }
}
