import { ReactNode } from "react";

export interface ApiError {
  status: number;
  data: {
    message: string;
    name?: string;
  };
}

export type ErrorResponse = {
  response: {
    data: {
      message: string;
      error: string;
    };
  };
};

