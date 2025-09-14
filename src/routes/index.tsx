import { AuthLayout } from "@components/Layout";
import { getThemeConfig } from "@config/theme";
import { ConfigProvider } from "antd";
import { lazyImport } from "@utils/lazyImports";
import { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./public";
import {AppLoader } from "@components/Loaders";
import { privateRoutes } from "./private";

const { Login } = lazyImport(() => import("@views/Auth/Login"), "Login");

const AppRoutes = () => {
  const commonRoutes = [
    { element: <AuthLayout />, children: [{ path: "/", element: <Login /> }] },
  ];
  const router = createBrowserRouter([...commonRoutes, ...publicRoutes, ...privateRoutes]);
  return (
    <ConfigProvider theme={getThemeConfig()}>
      <Suspense fallback={<AppLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </ConfigProvider>
  );
};

export default AppRoutes;