import React from "react";
import Image from "next/image";
import { Loader as ImgLoader } from "#assets/svg";

export const Loader = () => {
  return (
    <>
      {" "}
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
        <div>
          <Image src={ImgLoader} alt="" className="m-auto" loading="eager" />
          <p className="text-lg font-semibold text-center">Loading</p>
        </div>
      </div>
    </>
  );
};
