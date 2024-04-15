import { ContextConfig } from "../../utils/ContextConfig";
import { Document } from "../documents/Document";
import * as doclib from "../documents/index";
import { TCreateDocumentWithVersion } from "../documents/types";
import { TDomain } from "./types";

export class Domain {
  readonly _domain: TDomain;
  private _contextConfig: ContextConfig;

  constructor(domain: TDomain) {
    this._domain = domain;
    this._contextConfig = ContextConfig.getInstance();
  }

  get name() {
    return this._domain.name;
  }

  get nameHash() {
    return this._domain.nameHash;
  }

  get createdAt() {
    return this._domain.createdAt;
  }

  get updatedAt() {
    return this._domain.updatedAt;
  }

  document = async (path: string, publicEndpoint = false) => {
    const tDocument = await doclib.getDocument(
      publicEndpoint,
      `${this.name}/${path}`,
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );

    return new Document(tDocument);
  };

  addDocument = async (path: string, data: any, templates: string[] = []) => {
    const tDocument = await doclib.addDocument(
      `${this.name}/${path}`,
      data,
        templates,
      this._contextConfig.apiKey,
      this._contextConfig.config,
    );
    return new Document(tDocument);
  };

  createTemplate = async (path: string, data: any) => {
    const tDocument = await doclib.addDocument(
      `${this.name}/${path}`,
      data,
      [],
      this._contextConfig.apiKey,
      this._contextConfig.config,
        true
    );
    return new Document(tDocument);
  }
}
