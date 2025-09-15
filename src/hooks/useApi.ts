/* eslint-disable @typescript-eslint/no-explicit-any */
import { Notify } from "@components/General";
import { State } from "@models/application/state";
import { useGetDataOnClickMutation, usePostDataMutation } from "@/stores";
import { useAppStore } from "@store/useStore";
import { errorFormat } from "@/utils";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useCallback, useEffect } from "react";

export const useApi = () => {
  const state: State = useAppStore((state) => state);
  const [postData, postDataResult] = usePostDataMutation();
  const [getData, getDataResult] = useGetDataOnClickMutation();
  const pattysAPI = import.meta.env.VITE_APP_PATTYS_API_DOMAIN;

  const setData = useCallback(() => {
    if (postDataResult.data && postDataResult.data?.data) {
      if (state?.apiCallBack) state?.apiCallBack(postDataResult?.data?.data);
      if (state?.resetField) state?.resetField();
      Notify(postDataResult.data?.message, "success");
    }
    if (postDataResult.error) {
      const error: FetchBaseQueryError =
        postDataResult.error as FetchBaseQueryError;
      const errorData = error.data as any;
      Notify(errorData?.message as string, "error");
    }

    if (getDataResult.error) {
      const error: FetchBaseQueryError =
        getDataResult.error as FetchBaseQueryError;
      const errorData = error.data as any;
      Notify(errorFormat(errorData) as string, "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    postData,
    postDataResult.data,
    postDataResult.error,
    getDataResult.error,
  ]);

  useEffect(() => {
    setData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setData]);

  return {
    postData,
    postDataResult,
    loading: postDataResult.isLoading,
    isLoading: getDataResult.isLoading,
    getData,
    getDataResult,
    pattysAPI,
  };
};
