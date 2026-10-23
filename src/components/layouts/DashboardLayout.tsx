"use client";
import React, { ReactNode, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Dropdown, MenuProps, Tooltip } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuUserRound,
  LuLogOut,
  LuMenu,
  LuX,
  LuChevronDown,
  LuPanelLeftClose,
  LuPanelLeftOpen,
} from "react-icons/lu";
import { Logo } from "#assets/images";
import { Loader, Stagger, easeOut, fadeUp } from "#components/general";
import { useAuth, useAuthGuard } from "#/hooks";
import { useAppSelector } from "#store/hook";
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
  sidebarMark,
  sidebarToggle,
} from "#/styles/dashboard";
import { isActive } from "#/utils";
import { dashboardNav } from "#/config";
import { FaAngleLeft } from "react-icons/fa";

const SIDEBAR_COLLAPSED_KEY = "pattys-admin:sidebar-collapsed";

export const DashboardLayout: React.FC<{
  children: ReactNode;
  title?: string;
}> = ({ children, title }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setIsCollapsed((collapsed) => {
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(!collapsed));
      } catch {}
      return !collapsed;
    });
  };

  const collapsedHidden = isCollapsed ? "lg:hidden" : "";

  const { isAllowed } = useAuthGuard();
  const user = useAppSelector((state) => state.app.user);

  const activeItem = dashboardNav.find((item) => isActive(pathname, item.href));
  const pageTitle = title ?? activeItem?.label ?? "Dashboard";

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "Admin";

  const { onLogout } = useAuth();

  const userMenu: MenuProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      icon: <LuUserRound size={16} />,
      onClick: () => router.push("/dashboard/profile"),
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
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className={sidebarOverlay}
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      <aside
        id="dashboard-sidebar"
        className={`${sidebar} w-[260px] flex flex-col transition-[width,translate] duration-300 lg:translate-x-0 ${isCollapsed ? "lg:w-[80px]" : ""} ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`${sidebarLogo} ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`}
        >
          <Image
            src={Logo}
            alt="Pattys"
            className={`h-8 w-auto ${collapsedHidden}`}
            loading="eager"
          />
          <span className={`${sidebarLogoText} ${collapsedHidden}`}>Admin</span>
          {isCollapsed && (
            <span className={`${sidebarMark} max-lg:hidden`} aria-hidden>
              P
            </span>
          )}
          <button
            type="button"
            className="ml-auto text-black-200 lg:hidden cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          >
            <LuX size={20} />
          </button>
        </div>

        <button
          type="button"
          className={sidebarToggle}
          onClick={toggleCollapsed}
          aria-controls="dashboard-sidebar"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <LuPanelLeftOpen size={20} />
          ) : (
            <LuPanelLeftClose size={20} />
          )}
        </button>

        <Stagger
          delay={0.1}
          stagger={0.05}
          className={`flex-1 min-h-0 overflow-y-auto py-6 flex flex-col gap-1 ${isCollapsed ? "px-4 lg:px-3" : "px-4 mt-10"}`}
        >
          <nav className="flex flex-col gap-y-4">
            {dashboardNav.map(({ label, href, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <motion.div key={href} variants={fadeUp}>
                  <Tooltip
                    title={isCollapsed ? label : undefined}
                    placement="right"
                  >
                    <Link
                      href={href}
                      onClick={() => setIsSidebarOpen(false)}
                      aria-label={isCollapsed ? label : undefined}
                      className={`group relative flex items-center gap-3.5 rounded-10 px-4 py-3.5 text-base font-arial transition-colors ${isCollapsed ? "lg:justify-center lg:px-0" : ""} ${active ? "!text-purple-300 font-bold" : "!text-black-200 hover:!bg-white/60"}`}
                    >
                      {active && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-10 bg-white shadow-sm ring-1 ring-lilac-200/70"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 32,
                          }}
                        />
                      )}
                      <Icon
                        size={22}
                        className={`relative shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? "text-purple-200" : "text-grey-200"}`}
                      />
                      <span className={`relative ${collapsedHidden}`}>
                        {label}
                      </span>
                    </Link>
                  </Tooltip>
                </motion.div>
              );
            })}
          </nav>
        </Stagger>

        <div className={sidebarFooter}>
          <Tooltip
            title={isCollapsed ? "Log out" : undefined}
            placement="right"
          >
            <button
              type="button"
              className={`${sidebarLogout} ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`}
              onClick={onLogout}
              aria-label="Log out"
            >
              <LuLogOut size={22} className="shrink-0 text-red" />
              <span className={collapsedHidden}>Log out</span>
            </button>
          </Tooltip>
        </div>
      </aside>

      <div
        className={`flex flex-col min-h-[100svh] transition-[padding] duration-300 ${isCollapsed ? "lg:pl-[80px]" : "lg:pl-[260px]"}`}
      >
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
            {pageTitle !== "Overview" && (
              <button
                type="button"
                className="text-black-200 cursor-pointer"
                onClick={() => router.back()}
                aria-label="Go back"
              >
                <FaAngleLeft aria-hidden="true" />
              </button>
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.h1
                key={pageTitle}
                className={dashboardHeaderTitle}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: easeOut }}
              >
                {pageTitle}
              </motion.h1>
            </AnimatePresence>
          </div>

          <Dropdown
            menu={{ items: userMenu }}
            trigger={["click"]}
            onOpenChange={setIsUserMenuOpen}
          >
            <div className={dashboardHeaderUser}>
              <Avatar
                src={user?.avatar || user?.profileImage}
                className="!bg-lilac-200 !text-purple-300 !font-bold"
              >
                {fullName.charAt(0).toUpperCase()}
              </Avatar>
              <div className="flex flex-col leading-tight">
                <span className={dashboardHeaderName}>{fullName}</span>
                <span className={dashboardHeaderRole}>Administrator</span>
              </div>
              <motion.span
                className="flex"
                animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <LuChevronDown size={16} color="#77767d" />
              </motion.span>
            </div>
          </Dropdown>
        </header>

        <motion.main
          key={pathname}
          className={`${dashboardContent} flex-1`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOut }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};
