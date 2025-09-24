import {useCallback} from 'react'
import { useApi } from ".";
import { pattysAPI } from "@/config";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { postData, postDataResult, getData, getDataResult } = useApi();
  const navigate = useNavigate();

  const login = async (payload: object | any) => {
    const response: any = await postData({
      url: `${pattysAPI}auth/login`,
      request: payload,
    });

    if (response && "data" in response) {
      localStorage.setItem("***", response?.data?.token);
      navigate("/admin/dashboard");
    } else return;
  };

  const getAdmin = useCallback(() => {
    getData({
      url: `${pattysAPI}/auth/me`,
    });
  }, [getData])

  return {
    login,
    postDataResult,
    getAdmin,
    getDataResult,
  };
};
