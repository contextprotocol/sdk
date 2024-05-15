import { ContextConfig } from "../../utils/ContextConfig";
import { Document } from "../documents/Document";
import * as doclib from "../documents/index";
import { TDomain } from "./types";
import * as lib from "../index";
import {TMetadata} from "../versions/type";

export class Domain {
  readonly #domain: TDomain;
  readonly #contextConfig: ContextConfig;

  constructor(domain: TDomain) {
    this.#domain = domain;
    this.#contextConfig = ContextConfig.getInstance();
  }

  get name() {
    return this.#domain.name;
  }

  get documents() {
    return this.#domain.documents;
  }

  get status() {
    return this.#domain.status;
  }

  get owner() {
    return this.#domain.owner;
  }

  get nameHash() {
    return this.#domain.nameHash;
  }

  get createdAt() {
    return this.#domain.createdAt;
  }

  get updatedAt() {
    return this.#domain.updatedAt;
  }

  document = async (path: string, publicEndpoint = false) => {
    const tDocument = await doclib.getDocument(
      publicEndpoint,
      `${this.name}/${path}`,
      this.#contextConfig.apiKey,
      this.#contextConfig.config,
    );

    return new Document(tDocument);
  };

  createDocument = async (
    path: string,
    data: any,
    templates: string[] = [],
    isTemplate = false,
  ) => {
    const versionIds = await Promise.all(
      templates.map(async (template) => {
        const document = await doclib.getDocument(
          false,
          `${template}`,
          this.#contextConfig.apiKey,
          this.#contextConfig.config,
        );
        return document.version._id;
      }),
    );

    const tDocument = await doclib.createDocument(
      `${path}`,
      data,
      versionIds,
      this.#contextConfig.apiKey,
      this.#contextConfig.config,
      isTemplate,
    );

    return new Document(tDocument);
  };

  createAsset = async (
      documentPath: string,
      readme: string,
      filePath: string,
      metadata?: TMetadata
  ): Promise<Document> => {
    const asset = await lib.uploadAsset(
        documentPath,
        readme,
        filePath,
        metadata,
        this.#contextConfig.apiKey,
        this.#contextConfig.config,
    );
    console.log(`Asset: ${JSON.stringify(asset)}`)
    return new Document(asset.asset.document);
  }
}
