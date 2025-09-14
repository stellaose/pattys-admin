
import { Notify } from '@components/General';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

type BaseQueryType = ReturnType<typeof fetchBaseQuery>;
export const baseUrl = import.meta.env.VITE_APP_API_DOMAIN;
export const baseQueryWithReauth: (baseQuery: BaseQueryType) => BaseQueryType =
  (baseQuery) => async (args: any, api: any, extraOptions: any) => {
    try {
      const result = (await baseQuery(args, api, extraOptions)) as any;
      if (result?.error && result?.error?.status === 401) {
        window.location.href = '/';
        localStorage.clear();
      }
      return result;
    } catch (error) {
      Notify('Error occurred on the server. Please try again', false);
    }
  };



export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('***');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    //   headers.set('x_token_check', `973f5d8c724716d82a`);
    //   headers.set('x-merchant-id', getMerchantId());
    }
    return headers;
  },
});
