import { DashboardLayout } from "#components/layouts";

export default function Layout({ children }: LayoutProps<"/dashboard">) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
