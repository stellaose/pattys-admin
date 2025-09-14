import { DashboardLayout } from "@/components/Layout";
import { Routes, Route } from "react-router-dom";
import {
  Administrators,
  Customers,
  Dashboard,
  Orders,
  Products,
  Reports,
} from ".";

export const DashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard" element={<Customers />} />
        <Route path="/dashboard" element={<Products />} />
        <Route path="/dashboard" element={<Orders />} />
        <Route path="/dashboard" element={<Administrators />} />
        <Route path="/dashboard" element={<Reports />} />
      </Route>
    </Routes>
  );
};
