"use client";
import React, { ReactNode, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Dropdown, MenuProps } from "antd";
import {
  LuLayoutDashboard,
  LuFileText,
  LuUsers,
  LuMessageSquare,
  LuSettings,
  LuLogOut,
  LuMenu,
  LuX,
  LuChevronDown,
} from "react-icons/lu";
import { Logo } from "#assets/images";
import { Loader } from "#components/general";
import { useAuthGuard } from "#/hooks";
import { useAppSelector } from "#store/hook";
import { handleLogout } from "#/store/utils/logout";
import {
  dashboardBody,
  dashboardContent,
  dashboardHeader,
  dashboardHeaderName,
  dashboardHeaderRole,
  dashboardHeaderTitle,
  dashboardHeaderUser,
  sidebar,
  sidebarFooter,
  sidebarLogo,
  sidebarLogoText,
  sidebarLogout,
  sidebarOverlay,
} from "#/styles/dashboard";

export const dashboardNav = [
  { label: "Overview", href: "/dashboard", icon: LuLayoutDashboard },
  { label: "Blogs", href: "/dashboard/blogs", icon: LuFileText },
  { label: "Users", href: "/dashboard/users", icon: LuUsers },
  { label: "Comments", href: "/dashboard/comments", icon: LuMessageSquare },
  { label: "Settings", href: "/dashboard/settings", icon: LuSettings },
];

const isActive = (pathname: string, href: string) =>
  href === "/dashboard"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

export const DashboardLayout: React.FC<{
  children: ReactNode;
  title?: string;
}> = ({ children, title }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { isAllowed } = useAuthGuard();
  const user = useAppSelector((state) => state.app.user);

  const activeItem = dashboardNav.find((item) => isActive(pathname, item.href));
  const pageTitle = title ?? activeItem?.label ?? "Dashboard";

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Admin";

  const onLogout = () => {
    handleLogout();
    router.replace("/auth/login");
  };

  const userMenu: MenuProps["items"] = [
    {
      key: "settings",
      label: "Settings",
      icon: <LuSettings size={16} />,
      onClick: () => router.push("/dashboard/settings"),
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Log out",
      danger: true,
      icon: <LuLogOut size={16} />,
      onClick: onLogout,
    },
  ];

  if (!isAllowed) return <Loader />;

  return (
    <div className={dashboardBody}>
      {isSidebarOpen && (
        <div
          className={sidebarOverlay}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`${sidebar} w-[260px] flex flex-col transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className={sidebarLogo}>
          <Image
            src={Logo}
            alt="Pattys"
            className="h-8 w-auto brightness-0 invert"
            loading="eager"
          />
          <span className={sidebarLogoText}>Admin</span>
          <button
            type="button"
            className="ml-auto text-white lg:hidden cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          >
            <LuX size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {dashboardNav.map(({ label, href, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-10 px-4 py-3 text-sm font-arial transition ${active ? "!bg-purple-200 !text-white font-bold" : "!text-white-150 hover:!bg-white/10 hover:!text-white"}`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className={sidebarFooter}>
          <button type="button" className={sidebarLogout} onClick={onLogout}>
            <LuLogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      <div className="lg:pl-[260px] flex flex-col min-h-[100svh]">
        <header className={dashboardHeader}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden text-black-200 cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <LuMenu size={22} />
            </button>
            <h1 className={dashboardHeaderTitle}>{pageTitle}</h1>
          </div>

          <Dropdown menu={{ items: userMenu }} trigger={["click"]}>
            <div className={dashboardHeaderUser}>
              <Avatar
                src={user?.avatar || user?.profileImage}
                className="!bg-purple-200 !font-bold"
              >
                {fullName.charAt(0).toUpperCase()}
              </Avatar>
              <div className="flex flex-col leading-tight">
                <span className={dashboardHeaderName}>{fullName}</span>
                <span className={dashboardHeaderRole}>Administrator</span>
              </div>
              <LuChevronDown size={16} color="#77767d" />
            </div>
          </Dropdown>
        </header>

        <main className={`${dashboardContent} flex-1`}>{children}</main>
      </div>
    </div>
  );
};
