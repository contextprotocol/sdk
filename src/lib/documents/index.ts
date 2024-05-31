import {
  extractPathAndVersionNumber,
  transformVersionNumberToObject,
} from "../../utils/utils";
import { Config } from "../types";
import { TAllDocumentsResponse, TDocument, TDocumentFilter } from "./types";
import { TMetadata, TVersion } from "../versions/type";
import { FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import { _get, _patch, _post } from "../index";

export const getAllDocuments = async (
  fromPublicEndpoint: boolean,
  queryParams: TDocumentFilter,
  apiKey: string,
  config: Config,
): Promise<TAllDocumentsResponse> => {
  const url = fromPublicEndpoint
    ? `${config.url}/public/documents`
    : `${config.url}/documents`;
  const response = await _get<TAllDocumentsResponse>(url, queryParams, apiKey);

  return {
    documents: response.data.documents,
    total: response.data.total,
    limit: response.data.limit,
    offset: response.data.offset,
  } as TAllDocumentsResponse;
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
  const response = await _get<{ document: TDocument }>(url, {}, apiKey);
  return response.data.document;
};

export const createDocument = async (
  fullPath: string,
  data: any,
  templates: string[],
  apiKey: string,
  config: Config,
  metadata: TMetadata = {},
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
      metadata,
    },
  };
  const response = await _post<{ document: TDocument }>(url, createDoc, apiKey);
  return response.data.document;
};

export const updateDocument = async (
  fullPath: string,
  data: any,
  templates: string[],
  apiKey: string,
  config: Config,
): Promise<TDocument> => {
  const url = `${config.url}/documents/${fullPath}`;
  const updateDoc = {
    data,
    templates,
  };
  const response = await _patch<TDocument>(url, updateDoc, apiKey);
  return response.data;
};

export const updateMetadata = async (
  path: string,
  metadata: TMetadata,
  apiKey: string,
  config: Config,
): Promise<TDocument> => {
  const url = `${config.url}/documents/metadata/${path}`;
  let response = await _patch<{ document: TDocument }>(
    url,
    { metadata },
    apiKey,
  );
  return response.data.document;
};

export const updateAsset = async (
  path: string,
  filePath: string,
  metadata: TMetadata | undefined,
  apiKey: string,
  config: Config,
): Promise<{ asset: { document: TDocument; version: TVersion } }> => {
  const url = `${config.url}/assets/${path}`;

  const body = { metadata };
  const formData = new FormData();
  formData.append("file", await fileFromPath(filePath));
  formData.append("body", JSON.stringify(body));

  const response = await _patch<{
    asset: { document: TDocument; version: TVersion };
  }>(url, formData, apiKey);
  return response.data;
};

export const installTemplates = async (
  path: string,
  templatePathArray: string[],
  apiKey: string,
  config: Config,
): Promise<TDocument> => {
  const url = `${config.url}/documents/install/${path}`;
  const response = await _patch<TDocument>(
    url,
    { templates: templatePathArray },
    apiKey,
  );

  return response.data;
};

export const uninstallTemplates = async (
  path: string,
  templatePathArray: string[],
  apiKey: string,
  config: Config,
): Promise<TDocument> => {
  const url = `${config.url}/documents/uninstall/${path}`;
  const response = await _patch<TDocument>(
    url,
    { templates: templatePathArray },
    apiKey,
  );
  return response.data;
};
