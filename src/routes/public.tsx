import { lazyImport } from "@utils/lazyImports";
import NotFound from './NotFound'

const { AuthRoutes } = lazyImport(() => import("@views/Auth"), "AuthRoutes");

export const publicRoutes = [
  {
    path: "/auth/*",
    element: <AuthRoutes />,
    errorElement: <NotFound/>
  },
];
