import React from "react";
import { Button as AntdBtn, ButtonProps } from "antd";

type BtnProps = ButtonProps & {
  title: React.ReactNode;
  bgVariant: "primary" | "secondary" | "cancel" | "reject" | "success";
  className: string;
};

export const SubmitButton: React.FC<BtnProps> = ({
  title,
  bgVariant,
  className,
  ...btnRest
}) => {
  return (
    <>
      <AntdBtn
        {...btnRest}
        className={`${bgVariant === "primary" ? "!bg-purple-200 !border-purple-200 !text-white disabled:!bg-lilac-100 disabled:!border-lilac-200 disabled:!text-lilac-200" : bgVariant === "secondary" ? "!bg-black-100 !border-black !text-white disabled:!border-grey-100 disabled:!bg-grey-100 !shadow-btn" : bgVariant === "reject" ? "!bg-red !text-white !border-red" : bgVariant === "success" ? "!bg-green !text-white !border-green" : "!bg-transparent !text-black !border-black"} ${className} !h-15 rounded-lg transition transform duration-300 hover:scale-105 active:scale-[0.97] disabled:hover:scale-100 !font-bold`}
        htmlType="submit"
      >
        {title}
      </AntdBtn>
    </>
  );
};
