import React from "react";
import Logo from "@assets/logo/logo.png";
import { Outlet } from "react-router-dom";

export const AuthLayout: React.FC = () => {
  return (
    <>
      <div className="px-4 bg-white-100">
        <div className="p-3 shadow-md rounded-xl">
          <div className="flex gap-x-1 items-end max-w-[1440px] mx-auto ">
            <img src={Logo} alt="" className="h-12" />{" "}
            <span className="text-black-100 font-bold">Admin</span>
          </div>
        </div>

        <div className="h-[90svh] flex flex-col justify-center items-center ">
          <div className="w-[540px] max-w-[540px] bg-grey-300 py-8 px-6 rounded-xl flex flex-col gap-3">
           <Outlet/>
          </div>
        </div>
      </div>
    </>
  );
};
