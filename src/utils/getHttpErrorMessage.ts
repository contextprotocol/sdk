import { DEFAULT_INTERNAL_ERROR_MESSAGE } from "../constants";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getHttpErrorMessage = (error: any) => {
  // eslint-disable-next-line  @typescript-eslint/no-unsafe-return
  return (
    error.response?.data?.message ??
    error.message ??
    DEFAULT_INTERNAL_ERROR_MESSAGE
  );
};
