import type { Metadata } from "next";
import "./globals.css";
import { getThemeConfig } from "#config/theme";
import { App as AntApp, ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import { RouteProgress } from "#components/general";
import { Providers } from "./Provider";

export const metadata: Metadata = {
  title: "Pattys Admin",
  description: "Admin Dashboard for Pattys Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <RouteProgress />
        <Providers>
          <AntApp>
            <ConfigProvider theme={getThemeConfig()} locale={enUS}>
              <main>{children}</main>
            </ConfigProvider>
          </AntApp>
        </Providers>
      </body>
    </html>
  );
}
