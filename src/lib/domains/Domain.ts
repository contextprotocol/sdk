import { ContextConfig } from "../../utils/ContextConfig";
import { Document } from "../documents/Document";
import * as doclib from "../documents/index";
import { TDomain } from "./types";
import * as lib from "../index";
import { TMetadata } from "../versions/type";
import { ContextResult } from "../index";
import {_returnFailure, _returnObject} from "../../utils/utils";

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

  document = async (path: string, publicEndpoint = false): ContextResult<Document> => {
    try {
      const tDocument = await doclib.getDocument(
        publicEndpoint,
        `${this.name}/${path}`,
        this.#contextConfig.apiKey,
        this.#contextConfig.config,
      );

      return _returnObject(new Document(tDocument));
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
        this.#contextConfig.apiKey,
        this.#contextConfig.config,
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
        return document!.version._id;
      }),
    );

    const tDocument = await doclib.createDocument(
      `${path}`,
      data,
      versionIds,
      this.#contextConfig.apiKey,
      this.#contextConfig.config,
      metadata,
      isTemplate,
    );

    return new Document(tDocument);
  };
}
