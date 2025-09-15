import React from "react";
import { Button } from "antd";

export const SubmitButton: React.FC<{
  text: string;
  className?: string | any;
  htmlType: "button" | "reset" | "submit" | undefined | any;
  isLoading: boolean;
}> = ({ text, className, htmlType, isLoading }) => {
  return (
    <div>
      <Button
        className={`!bg-secondary !text-white transition duration-300 transform hover:scale-105 hover:!bg-[#c34c1d]  text-base ${className}`}
        htmlType={htmlType}
        loading={isLoading}
      >
        {text}
      </Button>
    </div>
  );
};
