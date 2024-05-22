import { FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import axios from "axios";

import { Config } from "./types";
import { getHttpHeaders } from "../utils/getHttpHeader";
import { ContextError, ContextErrorReason } from "../utils/ContextError";
import { getHttpErrorMessage } from "../utils/getHttpErrorMessage";
import { TDocument } from "./documents/types";
import { TMetadata, TVersion } from "./versions/type";

export { getAllDocuments, getDocument, createDocument } from "./documents";
export { getAllDomains, getDomain } from "./domains";

export const uploadAsset = async (
  path: string,
  filePath: string,
  metadata: TMetadata | null,
  apiKey: string,
  config: Config,
): Promise<{ asset: { document: TDocument; version: TVersion } } | null> => {
  const url = `${config.url}/assets`;

  const formData = new FormData();
  formData.append("file", await fileFromPath(filePath));
  formData.append("body", JSON.stringify({ path, metadata }));

  try {
    const response = await axios.post(url, formData, {
      headers: {
        ...getHttpHeaders(apiKey),
      },
    });

    if (response.status === 403) {
      throw new ContextError(ContextErrorReason.AuthError);
    }

    return response.data;
  } catch (error) {
    throw new Error(`ContextSDK: ${getHttpErrorMessage(error)}`);
  }
};
