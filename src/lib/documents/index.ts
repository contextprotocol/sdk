import axios from "axios";

import { getHttpErrorMessage } from "../../utils/getHttpErrorMessage";
import { getHttpHeaders } from "../../utils/getHttpHeader";
import { Config } from "../types";
import {
  TAllDocumentsResponse,
  TCreateDocumentWithVersion,
  TDocument,
  TDocumentFilter,
} from "./types";

export const getAllDocuments = async (
  fromPublicEndpoint: boolean,
  queryParams: TDocumentFilter,
  apiKey: string,
  config: Config,
): Promise<TAllDocumentsResponse> => {
  const url = fromPublicEndpoint
    ? `${config.url}/public/documents`
    : `${config.url}/documents`;
  try {
    const response = await axios.get(url, {
      params: queryParams,
      headers: getHttpHeaders(apiKey),
    });
    return {
      documents: response.data.documents,
      total: response.data.total,
      limit: response.data.limit,
      offset: response.data.offset,
    } as TAllDocumentsResponse;
  } catch (error) {
    throw new Error(`ContextSDK: ${getHttpErrorMessage(error)}`);
  }
};

export const getDocument = async (
  fromPublicEndpoint: boolean,
  name: string,
  apiKey: string,
  config: Config,
): Promise<TDocument> => {
  const url = fromPublicEndpoint
    ? `${config.url}/public/documents/${name}`
    : `${config.url}/documents/${name}`;
  try {
    const response = await axios.get(url, {
      headers: getHttpHeaders(apiKey),
    });
    return response.data.document;
  } catch (error) {
    throw new Error(`ContextSDK: ${getHttpErrorMessage(error)}`);
  }
};

export const addDocument = async (
  path: string,
  createDoc: TCreateDocumentWithVersion,
  apiKey: string,
  config: Config,
): Promise<TDocument> => {
  const url = `${config.url}/documents/${path}`;
  try {
    const response = await axios.post(url, createDoc, {
      headers: getHttpHeaders(apiKey),
    });
    return response.data.document;
  } catch (error) {
    throw new Error(`ContextSDK: ${getHttpErrorMessage(error)}`);
  }
};

export const addTemplate = async (
  path: string,
  template: string,
  apiKey: string,
  config: Config,
): Promise<TDocument> => {
  const url = `${config.url}/documents/add-template/${path}`;
  try {
    const response = await axios.post(
      url,
      { template },
      {
        headers: getHttpHeaders(apiKey),
      },
    );
    return response.data.document;
  } catch (error) {
    throw new Error(`ContextSDK: ${getHttpErrorMessage(error)}`);
  }
};
