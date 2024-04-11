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

export class Context {
  private _contextConfig: ContextConfig;
  constructor(apiKey: string, config?: Partial<Config>) {
    this._contextConfig = ContextConfig.getInstance();
    this._contextConfig.init(apiKey, config);
  }

  domains = async (
    domainFilter?: TDomainFilter,
  ): Promise<TAllDomainsResponse> => {
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

  domain = async (name: string): Promise<Domain> => {
    const tDomain = await lib.getDomain(
      false,
      name,
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );
    return new Domain(tDomain);
  };

  documents = async (
    documentFilter?: TDocumentFilter,
  ): Promise<TAllDocumentsResponse> => {
    const documentsResponse = await lib.getAllDocuments(
      false,
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

  private _publicDomains = async (
    domainFilter?: TDomainFilter,
  ): Promise<TAllDomainsResponse> => {
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
    const tDomain = await lib.getDomain(
      true,
      name,
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );
    return new Domain(tDomain);
  };

  private _publicDocuments = async (
    documentFilter?: TDocumentFilter,
  ): Promise<TAllDocumentsResponse> => {
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

  private _publicDocument = async (path: string): Promise<Document> => {
    const tDocument = await lib.getDocument(
      true,
      path,
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );
    return new Document(tDocument);
  };

  public = {
    domains: this._publicDomains,
    domain: this._publicDomain,
    documents: this._publicDocuments,
    document: this._publicDocument,
  };
}
