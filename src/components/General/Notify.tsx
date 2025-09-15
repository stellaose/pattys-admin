import { notification } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleFilled,
  CloseOutlined,
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
            : "text-orange"
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
    duration: duration || 4.5, // 4.5 seconds is Ant Design's default
    closeIcon: <CloseOutlined style={{ color: "#ffffff" }} />,
    icon:
      success === "success" ? (
        <CheckCircleOutlined style={{ color: "#ffffff" }} />
      ) : (
        <CloseCircleFilled style={{ color: "#ffffff" }} />
      ),
  });
};
