import { ContextConfig } from "../../utils/ContextConfig";
import { Document } from "../documents/Document";
import * as doclib from "../documents/index";
import { TCreateDocumentWithVersion } from "../documents/types";
import { TDomain } from "./types";

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

  createDocument = async (path: string, data: any, templates: string[] = []) => {
    const tDocument = await doclib.createDocument(
      `${this.name}/${path}`,
      data,
        templates,
      this.#contextConfig.apiKey,
      this.#contextConfig.config,
    );
    return new Document(tDocument);
  };

  createTemplate = async (path: string, data: any) => {
    const tDocument = await doclib.createDocument(
      `${this.name}/${path}`,
      data,
      [],
      this.#contextConfig.apiKey,
      this.#contextConfig.config,
        true
    );
    return new Document(tDocument);
  }
}
