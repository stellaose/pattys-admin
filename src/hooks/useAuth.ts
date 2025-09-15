import { useApi } from ".";
// import { State } from "@models/application/state";
// import { useAppStore } from "@store/useStore";
// import { useCallback } from "react";
import { pattysAPI } from "@/config";
// import { Notify } from "@components/General";
// import { useGetDataOnClickMutation, usePostDataMutation } from "@/stores";


export const useAuth = () => {
  const { postData, postDataResult } = useApi();
  // const [postData, postDataResult] = usePostDataMutation();

  const login = async (payload: object | any) => {
    const response: any = await postData({
      url: `${pattysAPI}auth/login`,
      request: payload,
    });

    console.log(response, response?.error, response?.status,"error" in response);
  //  if(response && "data" in response) {
  //     Notify(response?.data?.message, "success");
  //   }
  //   if (response && "error" in response) {
  //     Notify(
  //       response?.error?.data?.message || response?.error?.message,
  //       "error"
  //     );
  //   } 
  };

  return {
    login,
    postDataResult,
  };
};
