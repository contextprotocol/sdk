import { ContextConfig } from "../../utils/ContextConfig";
import * as versionlib from "../versions/index";
import {
  TAllVersionsResponse,
  TDocumentVersionFilter,
  TMetadata,
} from "../versions/type";
import * as documentlib from "./index";
import { DocumentType, TDocument } from "./types";

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
  ): Promise<TAllVersionsResponse> {
    return versionlib.getVersions(
      `${this.path}`,
      versionFilter || {},
      this.#contextConfig.apiKey,
      this.#contextConfig.config,
    );
  }

  async getVersion(versionNumber: string, publicEndpoint = false): Promise<Document | undefined> {
    const tDoc = await documentlib.getDocument(
      publicEndpoint,
      `${this.path}?versionNumber=${versionNumber}`,
      this.#contextConfig.apiKey,
      this.#contextConfig.config,
    );
    if (!tDoc) {
      return undefined;
    }
    return new Document(tDoc);
  }

  async update(data: any, templates: string[] = [], versionNumber?: string) {
    const version = await documentlib.updateDocument(
      `${this.path}`,
      data,
      templates,
      versionNumber,
      this.#contextConfig.apiKey,
      this.#contextConfig.config,
    );
    return new Document(version);
  }

  async addMetadata(metadata: any) {
    const tDocument = await documentlib.updateMetadata(
      `${this.path}`,
      metadata,
      this.#contextConfig.apiKey,
      this.#contextConfig.config,
    );
    return new Document(tDocument);
  }

  async updateMetadata(metadata: TMetadata, versionNumber?: string) {
    const tDocument = await documentlib.updateMetadata(
      `${this.path}`,
      metadata,
      this.#contextConfig.apiKey,
      this.#contextConfig.config,
      versionNumber,
    );
    return new Document(tDocument);
  }

  async updateAsset(
    filePath: string,
    metadata?: TMetadata,
    newVesionNumber?: string,
  ) {
    if (this.#document.type !== DocumentType.Asset) {
      throw new Error("Document is not an asset");
    }
    const asset = await documentlib.updateAsset(
      `${this.path}`,
      filePath,
      metadata,
      newVesionNumber,
      this.#contextConfig.apiKey,
      this.#contextConfig.config,
    );

    return new Document(asset!.asset.document);
  }
}
