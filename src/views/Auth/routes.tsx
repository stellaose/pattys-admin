import { AuthLayout } from "@components/Layout";
import { Routes, Route } from "react-router-dom";
import { Login, ResetPassword, ForgetPassword } from ".";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
    </Routes>
  );
};
