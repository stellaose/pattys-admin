import { notification } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleFilled,
  CloseOutlined,
} from "@ant-design/icons";

export const Notify = (
  message: string,
  isSuccess: boolean,
  duration?: number
) => {
  return notification.open({
    message: (
      <p className={`${!isSuccess ? "text-danger" : "text-success"}`}>
        {message}
      </p>
    ),
    placement: "top",
    className: `${
      !isSuccess ? "!border-danger" : "!border-success"
    } !bg-transparent border rounded-lg`,
    description: undefined,
    duration: duration || 4.5, // 4.5 seconds is Ant Design's default
    closeIcon: <CloseOutlined style={{ color: "#ffffff" }} />,
    icon: !isSuccess ? (
      <CloseCircleFilled style={{ color: "#ffffff" }} />
    ) : (
      <CheckCircleOutlined style={{ color: "#ffffff" }} />
    ),
  });
};
