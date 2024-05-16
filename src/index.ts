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
import { ContextError, ContextErrorReason } from "./utils/ContextError";
import {TMetadata} from "./lib/versions/type";

export class Context {
  private _contextConfig: ContextConfig;
  private _domain: Domain | undefined;
  private _initialized = false;

  constructor(contextInit: { apiKey: string; config?: Partial<Config> }) {
    if (!contextInit.apiKey) {
      throw new Error("ContextSDK: API key is required");
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

  domain = async (name?: string): Promise<Domain | null> => {
    await this._checkIfSDKIsInitialized();

    if (!name) {
      return this._domain;
    }

    const tDomain = await lib.getDomain(
      false,
      name,
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );
    if (!tDomain) return null;
    return new Domain(tDomain);
  };

  documents = async (
    documentFilter?: TDocumentFilter,
  ): Promise<TAllDocumentsResponse> => {
    await this._checkIfSDKIsInitialized();

    const documentsResponse = await lib.getAllDocuments(
      this._domain === undefined,
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
  };

  document = async (
    path: string,
  ): Promise<Document> => {
    await this._checkIfSDKIsInitialized();

    const documentResponse = await lib.getDocument(
      false,
      path,
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );
    return new Document(documentResponse as TDocument);
  };

  createDocument = async (
    path: string,
    data: any,
    templates: string[] = [],
    isTemplate = false,
  ) => {
    const versionIds = await Promise.all(
      templates.map(async (template) => {
        const document = await lib.getDocument(
          false,
          `${template}`,
          this._contextConfig.apiKey,
          this._contextConfig.config,
        );
        return document.version._id;
      }),
    );

    const tDocument = await lib.createDocument(
      `${path}`,
      data,
      versionIds,
      this._contextConfig.apiKey,
      this._contextConfig.config,
      isTemplate,
    );

    return new Document(tDocument);
  }

  createAsset = async (
    documentPath: string,
    filePath: string,
    metadata?: TMetadata
  ): Promise<Document> => {
    const asset = await lib.uploadAsset(
        documentPath,
        filePath,
        metadata,
        this._contextConfig.apiKey,
        this._contextConfig.config,
    );
    return new Document(asset.asset.document);
  }

  private _publicDomains = async (
    domainFilter?: TDomainFilter,
  ): Promise<TAllDomainsResponse> => {
    await this._checkIfSDKIsInitialized();

    const domainsResponse = await lib.getAllDomains(
      true,
      domainFilter || {},
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );
    return {
      ...domainsResponse,
      domains: domainsResponse.domains.map((d) => new Domain(d as TDomain)),
    };
  };

  private _publicDomain = async (name: string): Promise<Domain> => {
    await this._checkIfSDKIsInitialized();

    let tDomain;
    try {
      tDomain = await lib.getDomain(
        true,
        name,
        this._contextConfig.apiKey,
        this._contextConfig.config,
      );
    } catch (e) {
      if (e instanceof ContextError) {
        const contextError = e;
        switch (contextError.reason) {
          case ContextErrorReason.DomainNotFound:
            return null;
          default:
            break;
        }
      }
      throw e;
    }

    return new Domain(tDomain);
  };

  private _publicDocuments = async (
    documentFilter?: TDocumentFilter,
  ): Promise<TAllDocumentsResponse> => {
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
  };

  private _publicDocument = async (path: string): Promise<Document | null> => {
    await this._checkIfSDKIsInitialized();
    let tDocument;

    try {
      tDocument = await lib.getDocument(
        true,
        path,
        this._contextConfig.apiKey,
        this._contextConfig.config,
      );
    } catch (e) {
      if (e instanceof ContextError) {
        const contextError = e;
        switch (contextError.reason) {
          case ContextErrorReason.DocumentNotFound:
            return null;
          default:
            break;
        }
      }
      throw e;
    }
    return new Document(tDocument);
  };
}
