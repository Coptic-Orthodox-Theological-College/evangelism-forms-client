import { notification } from "antd";

export const openNotificationWithIcon = (type, header, message) => {
  notification[type]({
    message: header,
    description: message,
  });
  notification.config({
    duration: 10,
  });
};