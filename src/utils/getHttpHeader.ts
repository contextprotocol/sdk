import { CONTEXT_API_KEY_HEADER } from "../constants";

export const getHttpHeaders = (contextApiKey: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headers: any = {};
  headers[CONTEXT_API_KEY_HEADER] = contextApiKey;

  return headers;
};
