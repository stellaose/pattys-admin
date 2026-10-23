"use client";
import {
  LuActivity,
  LuLayoutDashboard,
  LuFileText,
  LuUsers,
  LuMessageSquare,
  LuMail,
  LuShieldCheck,
  LuKeyRound,
  LuUserRound,
} from "react-icons/lu";
export const PROD = "development" as "development" | "production";
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const FORM_METHODS = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

export const dashboardNav = [
  { label: "Overview", href: "/dashboard", icon: LuLayoutDashboard },
  { label: "Blogs", href: "/dashboard/blogs", icon: LuFileText },
  { label: "Bloggers", href: "/dashboard/bloggers", icon: LuUsers },
  { label: "Comments", href: "/dashboard/comments", icon: LuMessageSquare },
  { label: "Contact", href: "/dashboard/contact", icon: LuMail },
  {
    label: "Administrators",
    href: "/dashboard/administrators",
    icon: LuShieldCheck,
  },
  { label: "Roles", href: "/dashboard/roles", icon: LuKeyRound },
  { label: "Activity", href: "/dashboard/activity", icon: LuActivity },
  { label: "Profile", href: "/dashboard/profile", icon: LuUserRound },
];
