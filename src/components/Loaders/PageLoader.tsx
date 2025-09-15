import React from "react";
import Loader from "@assets/svg/bar-loader.svg";

export const PageLoader: React.FC = () => {
  return (
    <div className="">
      <div className="flex justify-center items-center h-[100svh] w-[100svw]">
        <img src={Loader} alt="" className='w-[200px] h-auto'/>
      </div>
    </div>
  );
};
