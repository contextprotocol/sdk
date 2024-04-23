import { ContextConfig } from "../../utils/ContextConfig";
import * as versionlib from "../versions/index";
import { TAllVersionsResponse, TDocumentVersionFilter } from "../versions/type";
import * as documentlib from "./index";
import { TDocument } from "./types";

export class Document {
  readonly #document: TDocument;
  readonly #contextConfig: ContextConfig;

  constructor(document: TDocument) {
    this.#document = document;
    this.#contextConfig = ContextConfig.getInstance();
  }

  get path() {
    return this.#document.path;
  }
  get versionNumber() {
    return this.#document.versionNumber;
  }

  get data() {
    // eslint-disable-next-line  @typescript-eslint/no-unsafe-return
    return this.#document.version.data;
  }

  get createdAt() {
    return this.#document.createdAt;
  }
  get updatedAt() {
    return this.#document.updatedAt;
  }

  async versions(
    versionFilter?: TDocumentVersionFilter,
  ): Promise<TAllVersionsResponse> {
    return versionlib.getVersions(
      `${this.#document.domainId.name}/${this.path}`,
      versionFilter || {},
      this.#contextConfig.apiKey,
      this.#contextConfig.config,
    );
  }

  async getVersion(versionNumber: string, publicEndpoint = false) {
    const tDoc = await documentlib.getDocument(
      publicEndpoint,
      `${this.#document.domainId.name}/${this.path}?versionNumber=${versionNumber}`,
      this.#contextConfig.apiKey,
      this.#contextConfig.config,
    );
    return new Document(tDoc);
  }

  async addTemplate(templatePath: string): Promise<Document> {
    const tDoc = await documentlib.addTemplate(
      `${this.#document.domainId.name}/${this.path}`,
      templatePath,
      this.#contextConfig.apiKey,
      this.#contextConfig.config,
    );
    return new Document(tDoc);
  }
}
