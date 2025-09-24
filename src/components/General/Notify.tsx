import { notification } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleFilled,
  CloseOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

export const Notify = (message: string, success: string, duration?: number) => {
  return notification.open({
    message: (
      <p
        className={`${
          success === "error"
            ? "text-danger"
            : success === "success"
            ? "text-success"
            : "text-warning"
        }`}
      >
        {message}
      </p>
    ),
    placement: "top",
    className: `${
      success === "error"
        ? "!border-danger"
        : success === "success"
        ? "!border-success"
        : "border-warning"
    } !bg-transparent border rounded-lg`,
    description: undefined,
    duration: duration || 4.5, 
    closeIcon: (
      <CloseOutlined
        style={{
          color:
            success === "success"
              ? "#02c567"
              : success === "error"
              ? "#f33f3f"
              : "#f47b23",
        }}
      />
    ),
    icon:
      success === "success" ? (
        <CheckCircleOutlined style={{ color: "#02c567" }} />
      ) :  success === "error" ? (
        <CloseCircleFilled style={{ color: "#f33f3f" }} />
      ) : (
        <ExclamationCircleOutlined  style={{ color: "#f47b23" }} />
      ),
  });
};
