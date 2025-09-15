import React from "react";
import Loader from "@assets/svg/loader.svg";

export const AppLoader: React.FC = () => {
  return (
    <div className="">
      <div className="flex justify-center items-center h-[100svh] w-[100svw]">
        <img src={Loader} alt="" className='w-[120px] h-auto'/>
      </div>
    </div>
  );
};
