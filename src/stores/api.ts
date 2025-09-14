import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery, baseQueryWithReauth } from './apiConfig';

const appApi = createApi({
  reducerPath: 'app',
  baseQuery: baseQueryWithReauth(baseQuery),
  endpoints(builder) {
    return {
      getData: builder.query({
        query: (url) => {
          return { url };
        },
      }),
      postData: builder.mutation({
        query: (data) => {
          return {
            url: data.url,
            method: data.method ? data.method : 'POST',
            body: data?.request,
          };
        },
      }),
      getDataOnClick: builder.mutation({
        query: (data) => {
          return {
            url: data.url,
            method: 'GET',
          };
        },
      }),
    };
  },
});

export const { usePostDataMutation, useGetDataQuery, useGetDataOnClickMutation } = appApi;
export { appApi };
