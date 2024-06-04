import { ContextConfig } from "../../utils/ContextConfig";
import * as versionlib from "../versions/index";
import {
  TAllVersionsResponse,
  TDocumentVersionFilter,
  TMetadata,
} from "../versions/type";
import * as documentlib from "./index";
import { DocumentType, TDocument } from "./types";
import { ContextError } from "../../utils/ContextError";
import { ContextResult } from "../index";
import {_returnFailure, _returnObject} from "../../utils/utils";

export class Document {
  readonly #document: TDocument;
  readonly #contextConfig: ContextConfig;

  constructor(document: TDocument) {
    this.#document = document;
    this.#contextConfig = ContextConfig.getInstance();
  }

  toJSON() {
    return {
      path: this.path,
      versionNumber: this.versionNumber,
      data: this.data,
      templates: this.templates,
      txId: this.txId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  get path() {
    return `${this.#document.domainId.name}/${this.#document.path}`;
  }

  get versionNumber() {
    return this.#document.version.versionNumber;
  }

  get data() {
    // eslint-disable-next-line  @typescript-eslint/no-unsafe-return
    return this.#document.version.data;
  }

  get templates() {
    const templateNamesWithVersions = this.#document.version.templates.map(
      (doc) => {
        const domainName = doc.documentId.domainId.name;
        const path = doc.documentId.path;
        const version = doc.versionNumber;
        return `${domainName}/${path}?v=${version}`;
      },
    );
    return templateNamesWithVersions;
  }

  get txId() {
    return this.#document.version.txId;
  }

  get createdAt() {
    return this.#document.createdAt;
  }

  get updatedAt() {
    return this.#document.updatedAt;
  }

  get metadata() {
    return this.#document.version.metadata;
  }

  get type() {
    return this.#document.type;
  }

  async versions(
    versionFilter?: TDocumentVersionFilter,
  ): ContextResult<TAllVersionsResponse> {
    try {
      const versions = await versionlib.getVersions(
        `${this.path}`,
        versionFilter || {},
        this.#contextConfig.apiKey,
        this.#contextConfig.config,
      );
      return _returnObject(versions);
    } catch (e) {
      return _returnFailure(e);
    }
  }

  async getVersion(
    versionNumber: string,
    publicEndpoint = false,
  ): ContextResult<Document> {
    try {
      const tDoc = await documentlib.getDocument(
        publicEndpoint,
        `${this.path}?versionNumber=${versionNumber}`,
        this.#contextConfig.apiKey,
        this.#contextConfig.config,
      );
      return _returnObject(new Document(tDoc));
    } catch (e) {
      return _returnFailure(e);
    }
  }

  async update(data: any): ContextResult<Document> {
    try {
      const version = await documentlib.updateDocument(
        `${this.path}`,
        data,
        this.#contextConfig.apiKey,
        this.#contextConfig.config,
      );
      return _returnObject(new Document(version));
    } catch (e) {
      return _returnFailure(e);
    }
  }

  async addMetadata(metadata: any): ContextResult<Document> {
    try {
      const tDocument = await documentlib.updateMetadata(
        `${this.path}`,
        metadata,
        this.#contextConfig.apiKey,
        this.#contextConfig.config,
      );
      return _returnObject(new Document(tDocument));
    } catch (e) {
      return _returnFailure(e);
    }
  }

  async install(templatePathArray: string[]): ContextResult<Document> {
    try {
      const tDocument = await documentlib.installTemplates(
        `${this.path}`,
        templatePathArray,
        this.#contextConfig.apiKey,
        this.#contextConfig.config,
      );
      return _returnObject(new Document(tDocument));
    } catch (e) {
      return _returnFailure(e);
    }
  }

  async uninstall(templatePathArray: string[]): ContextResult<Document> {
    try {
      const tDocument = await documentlib.uninstallTemplates(
        `${this.path}`,
        templatePathArray,
        this.#contextConfig.apiKey,
        this.#contextConfig.config,
      );
      return _returnObject(new Document(tDocument));
    } catch (e) {
      return _returnFailure(e);
    }
  }

  async updateMetadata(metadata: TMetadata): ContextResult<Document> {
    try {
      const tDocument = await documentlib.updateMetadata(
        `${this.path}`,
        metadata,
        this.#contextConfig.apiKey,
        this.#contextConfig.config,
      );
      return _returnObject(new Document(tDocument));
    } catch (e) {
      return _returnFailure(e);
    }
  }

  async updateAsset(filePath: string, metadata?: TMetadata): ContextResult<Document> {
    try {
      if (this.#document.type !== DocumentType.Asset) {
        throw new ContextError({
          message: "This document is not an asset",
          error: "This document is not an asset",
        });
      }
      const asset = await documentlib.updateAsset(
        `${this.path}`,
        filePath,
        metadata,
        this.#contextConfig.apiKey,
        this.#contextConfig.config,
      );

      return _returnObject(new Document(asset!.asset.document));
    } catch (e) {
      return _returnFailure(e);
    }
  }
}
