import { lazyImport } from "@/utils/lazyImports";
import NotFound from './NotFound'
const { DashboardRoutes } = lazyImport(
  () => import("@views/Dashboard"),
  "DashboardRoutes"
);

export const privateRoutes = [
  {
    path: "/dashboard/*",
    element: <DashboardRoutes />,
    errorElement: <NotFound/>
  },
];
