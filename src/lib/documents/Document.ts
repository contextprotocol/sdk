import { ContextConfig } from "../../utils/ContextConfig";
import * as versionlib from "../versions/index";
import { TAllVersionsResponse, TDocumentVersionFilter } from "../versions/type";
import * as documentlib from "./index";
import { TDocument } from "./types";

export class Document {
  protected _document: TDocument;
  private _contextConfig: ContextConfig;
  readonly;
  constructor(document: TDocument) {
    this._document = document;
    this._contextConfig = ContextConfig.getInstance();
  }

  get path() {
    return this._document.path;
  }
  get versionNumber() {
    return this._document.versionNumber;
  }

  get data() {
    // eslint-disable-next-line  @typescript-eslint/no-unsafe-return
    return this._document.version.data;
  }

  get createdAt() {
    return this._document.createdAt;
  }
  get updatedAt() {
    return this._document.updatedAt;
  }

  async versions(
    versionFilter?: TDocumentVersionFilter,
  ): Promise<TAllVersionsResponse> {
    return versionlib.getVersions(
      `${this._document.domainId.name}/${this.path}`,
      versionFilter || {},
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );
  }

  async getVersion(versionNumber: string, publicEndpoint = false) {
    const tDoc = await documentlib.getDocument(
      publicEndpoint,
      `${this._document.domainId.name}/${this.path}?versionNumber=${versionNumber}`,
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );
    return new Document(tDoc);
  }

  async addTemplate(templatePath: string): Promise<Document> {
    const tDoc = await documentlib.addTemplate(
      `${this._document.domainId.name}/${this.path}`,
      templatePath,
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );
    return new Document(tDoc);
  }
}
