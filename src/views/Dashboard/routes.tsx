import { DashboardLayout } from "@/components/Layout";
import { Routes, Route } from "react-router-dom";
import {
  Administrators,
  Customers,
  Dashboard,
  Orders,
  Products,
  Reports,
  Settings
} from ".";

export const DashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/administrators" element={<Administrators />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};
