/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "#store/hook";
import { setAllAppKeys } from "#/store";

export const useFieldRequest = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => {
    return state.app;
  });

  const setRequestField = useCallback(
    (key: string, value: any, options?: any[], key2?: string) => {
      const update: any = {
        [key]: value,
      };
      if (key2 && options) {
        update[key2] = options.filter((x) => x.id === value)[0].id;
      }
      dispatch(
        setAllAppKeys({
          ...state,
          request: {
            ...state.request,
            ...update,
          },
        })
      );
    },
    [state]
  );

  return {
    setRequestField,
  };
};
