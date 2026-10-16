"use client";
import { App } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleFilled,
  CloseOutlined,
} from "@ant-design/icons";

export const useNotify = () => {
  const { notification } = App.useApp();

  const Notify = (message: string, isSuccess: boolean, duration?: number) => {
    notification.open({
      title: undefined,
      placement: "top",
      className: `${!isSuccess ? "!text-red !border-red " : "!text-green !border-green"} !bg-white !rounded-lg  !border`,
      description: (
        <span
          className={`!text-sm !font-medium ${!isSuccess ? "!text-red" : "!text-green"}`}
        >
          {message?.slice(0, 1)?.toUpperCase() + message.slice(1)}
        </span>
      ),
      duration: duration || 4.5,
      closeIcon: (
        <CloseOutlined style={{ color: isSuccess ? "#268941" : "#d32f2f" }} />
      ),
      icon: !isSuccess ? (
        <CloseCircleFilled style={{ color: "#d32f2f" }} />
      ) : (
        <CheckCircleOutlined style={{ color: "#268941" }} />
      ),
    });
  };

  return { Notify };
};
