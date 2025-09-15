import { ErrorResponse } from "./type";

export const errorFormat = (error: ErrorResponse | undefined) => {
  return error && error.message ? error.message : 'Something went wrong, please try again!';
};