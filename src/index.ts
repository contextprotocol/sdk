import * as lib from "./lib";
import { Document } from "./lib/documents/Document";
import {
  TAllDocumentsResponse,
  TDocument,
  TDocumentFilter,
} from "./lib/documents/types";
import { Domain } from "./lib/domains/Domain";
import {
  TAllDomainsResponse,
  TDomain,
  TDomainFilter,
} from "./lib/domains/types";
import { Config } from "./lib/types";
import { ContextConfig } from "./utils/ContextConfig";
import { ContextError, ContextErrorResponse } from "./utils/ContextError";
import { TMetadata } from "./lib/versions/type";
import { ContextResult } from "./lib";
import {_returnFailure, _returnObject} from "./utils/utils";

export type { Domain } from "./lib/domains/Domain";
export type { Document } from "./lib/documents/Document";
export type { TAllDocumentsResponse, TDocumentFilter } from "./lib/documents/types";
export type { ContextErrorResponse } from "./utils/ContextError";
export type { ContextResult } from "./lib";

export class Context {
  private _contextConfig: ContextConfig;
  private _domain: Domain | undefined;
  private _initialized = false;

  constructor(contextInit: { apiKey: string; config?: Partial<Config> }) {
    if (!contextInit.apiKey) {
      throw new ContextError({
        message: "API key is required",
        error: `API key is required`,
      });
    }
    this._contextConfig = ContextConfig.getInstance();
    this._contextConfig.init(contextInit.config);
    this._contextConfig.apiKey = contextInit.apiKey;
  }

  private _init = async (contextInit: { apiKey: string }) => {
    this._initialized = true;
    const domains = await this._domains();
    this._domain = new Domain(domains.domains[0] as TDomain);
  };

  private _checkIfSDKIsInitialized = async () => {
    if (!this._initialized) {
      await this._init({ apiKey: this._contextConfig.apiKey });
    }
  };

  private _domains = async (
    domainFilter?: TDomainFilter,
  ): Promise<TAllDomainsResponse> => {
    await this._checkIfSDKIsInitialized();
    const domainsResponse = await lib.getAllDomains(
      false,
      domainFilter || {},
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );
    return {
      ...domainsResponse,
      domains: domainsResponse.domains.map((d) => new Domain(d as TDomain)),
    };
  };

  domain = async (name?: string): ContextResult<Domain | undefined> => {
    try {
      await this._checkIfSDKIsInitialized();

      if (!name) {
        return _returnObject(this._domain);
      }

      const tDomain = await lib.getDomain(
        false,
        name,
        this._contextConfig.apiKey,
        this._contextConfig.config,
      );
      if (!tDomain) return _returnObject(undefined);
      return _returnObject(new Domain(tDomain));
    } catch (e) {
      return _returnFailure(e);
    }
  };

  documents = async (
    documentFilter?: TDocumentFilter,
  ): ContextResult<TAllDocumentsResponse> => {
    try {
      await this._checkIfSDKIsInitialized();

      const documentsResponse = await lib.getAllDocuments(
        this._domain === undefined,
        documentFilter || {},
        this._contextConfig.apiKey,
        this._contextConfig.config,
      );
      const data = {
        ...documentsResponse,
        documents: documentsResponse.documents.map(
          (d) => new Document(d as TDocument),
        ),
      };
      return _returnObject(data);
    } catch (e) {
      return _returnFailure(e);
    }
  };

  document = async (path: string): ContextResult<Document> => {
    try {
      await this._checkIfSDKIsInitialized();

      const documentResponse = await lib.getDocument(
        false,
        path,
        this._contextConfig.apiKey,
        this._contextConfig.config,
      );
      return _returnObject(new Document(documentResponse as TDocument));
    } catch (e) {
      return _returnFailure(e);
    }
  };

  createDocument = async (
    path: string,
    data: any,
    templates: string[] = [],
    metadata: TMetadata = {},
  ) => {
    try {
      return _returnObject(await this._createDocument(path, data, templates, metadata, false));
    } catch (e) {
      return _returnFailure(e);
    }
  };

  createTemplate = async (
    path: string,
    data: any,
    templates: string[] = [],
    metadata: TMetadata = {},
  ) => {
    try {
      return _returnObject(await this._createDocument(path, data, templates, metadata, true));
    } catch (e) {
      return _returnFailure(e);
    }
  };

  createAsset = async (
    documentPath: string,
    filePath: string,
    metadata?: TMetadata,
  ): ContextResult<Document> => {
    try {
      const asset = await lib.uploadAsset(
        documentPath,
        filePath,
        metadata,
        this._contextConfig.apiKey,
        this._contextConfig.config,
      );
      return _returnObject(new Document(asset!.asset.document));
    } catch (e) {
      return _returnFailure(e);
    }
  };

  private _createDocument = async (
    path: string,
    data: any,
    templates: string[] = [],
    metadata: TMetadata = {},
    isTemplate,
  ) => {
    const versionIds = await Promise.all(
      templates.map(async (template) => {
        const document = await lib.getDocument(
          false,
          `${template}`,
          this._contextConfig.apiKey,
          this._contextConfig.config,
        );
        return document!.version._id;
      }),
    );

    const tDocument = await lib.createDocument(
      `${path}`,
      data,
      versionIds,
      this._contextConfig.apiKey,
      this._contextConfig.config,
      metadata,
      isTemplate,
    );

    return new Document(tDocument);
  };

  private _publicDomains = async (
    domainFilter?: TDomainFilter,
  ) => {
    await this._checkIfSDKIsInitialized();

    const domainsResponse = await lib.getAllDomains(
      true,
      domainFilter || {},
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );
    const data = {
      ...domainsResponse,
      domains: domainsResponse.domains.map((d) => new Domain(d as TDomain)),
    };

    return data;
  };

  private _publicDomain = async (name: string): Promise<Domain | undefined> => {
    await this._checkIfSDKIsInitialized();

    let tDomain;
    tDomain = await lib.getDomain(
      true,
      name,
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );

    return new Domain(tDomain);
  };

  private _publicDocuments = async (
    documentFilter?: TDocumentFilter,
  ) => {
    try {
      await this._checkIfSDKIsInitialized();

      const documentsResponse = await lib.getAllDocuments(
        true,
        documentFilter || {},
        this._contextConfig.apiKey,
        this._contextConfig.config,
      );
      return {
        ...documentsResponse,
        documents: documentsResponse.documents.map(
          (d) => new Document(d as TDocument),
        ),
      };
    } catch (e) {
      return _returnFailure(e);
    }
  };

  private _publicDocument = async (path: string): Promise<Document | null> => {
    await this._checkIfSDKIsInitialized();
    let tDocument;

    tDocument = await lib.getDocument(
      true,
      path,
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );

    return new Document(tDocument);
  };
}
