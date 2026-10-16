import { Rule } from "antd/es/form";

export const emailRule: Rule[] = [
  { required: true, message: "E-mail is required" },
  { type: "email", message: "Enter a valid e-mail" },
];

export const otpRule: Rule[] = [
  { required: true, message: "Verification code is required" },
  { len: 6, message: "Enter the 6-digit code" },
];

export const passwordRule: Rule[] = [
  { required: true, message: "Password is required" },
  {
    pattern: new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!.%*?&])[A-Za-z\\d@$!.%*?&]{8,}$",
    ),
    message:
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
  },
];

export const confirmPasswordRule: Rule[] = [
  { required: true, message: "Confirm password is required" },
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match"));
    },
  }),
];
