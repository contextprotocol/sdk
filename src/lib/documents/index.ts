import axios from "axios";

import { ContextError, ContextErrorReason } from "../../utils/ContextError";
import { getHttpErrorMessage } from "../../utils/getHttpErrorMessage";
import { getHttpHeaders } from "../../utils/getHttpHeader";
import {
  extractPathAndVersionNumber,
  transformVersionNumberToObject,
} from "../../utils/utils";
import { Config } from "../types";
import { TAllDocumentsResponse, TDocument, TDocumentFilter } from "./types";

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
): Promise<TDocument | null> => {
  const url = fromPublicEndpoint
    ? `${config.url}/public/documents/${name}`
    : `${config.url}/documents/${name}`;
  try {
    const response = await axios.get(url, {
      headers: getHttpHeaders(apiKey),
    });
    if (response.status === 403) {
      throw new ContextError(ContextErrorReason.AuthError);
    } else if (response.status === 404) {
      throw new ContextError(ContextErrorReason.DocumentNotFound);
    }
    return response.data.document;
  } catch (error) {
    throw new Error(`ContextSDK: ${getHttpErrorMessage(error)}`);
  }
};

export const createDocument = async (
  fullPath: string,
  data: any,
  templates: string[],
  apiKey: string,
  config: Config,
  isTemplate = false,
): Promise<TDocument> => {
  const url = `${config.url}/documents`;
  const { pathOrId, versionNumber } = extractPathAndVersionNumber("", fullPath);
  const versionFilter = transformVersionNumberToObject(
    versionNumber || "1.0.0",
  );

  const createDoc = {
    document: {
      path: pathOrId,
      isTemplate,
    },
    version: {
      data,
      templates,
      ...versionFilter,
    },
  };
  try {
    const response = await axios.post(url, createDoc, {
      headers: getHttpHeaders(apiKey),
    });

    if (response.status === 403) {
      throw new ContextError(ContextErrorReason.AuthError);
    } else if (response.status === 404) {
      throw new ContextError(ContextErrorReason.DocumentNotFound);
    }

    return response.data.document;
  } catch (error) {
    throw new Error(`ContextSDK: ${getHttpErrorMessage(error)}`);
  }
};

export const updateDocument = async (
  fullPath: string,
  data: any,
  templates: string[],
  versionNumber: string | undefined,
  apiKey: string,
  config: Config,
): Promise<TDocument> => {
  const url = `${config.url}/documents/${fullPath}`;
  const updateDoc = {
    data,
    templates,
    versionNumber,
  };
  try {
    const response = await axios.patch(url, updateDoc, {
      headers: getHttpHeaders(apiKey),
    });

    if (response.status === 403) {
      throw new ContextError(ContextErrorReason.AuthError);
    } else if (response.status === 404) {
      throw new ContextError(ContextErrorReason.DocumentNotFound);
    }

    return response.data;
  } catch (error) {
    throw new Error(`ContextSDK: ${getHttpErrorMessage(error)}`);
  }
};
