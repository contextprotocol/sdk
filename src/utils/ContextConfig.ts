import { CONTEXT_URL, VERSION } from "../constants";
import { Config } from "../lib/types";

export class ContextConfig {
  private _apiKey: string;
  private _config: Config;

  private _generateConfig = (config?: Partial<Config>): Config => {
    return {
      version: config?.version ?? VERSION,
      url: config?.url ?? CONTEXT_URL,
    };
  };

  public init = (config?: Partial<Config>) => {
    this._config = this._generateConfig(config);
  };

  public set apiKey(apiKey: string) {
    this._apiKey = apiKey;
  }

  public get apiKey() {
    return this._apiKey;
  }

  public get config() {
    return this._config;
  }

  public static getInstance() {
    if (!ContextConfig._instance) {
      ContextConfig._instance = new ContextConfig();
    }
    return ContextConfig._instance;
  }

  private static _instance: ContextConfig;
}
