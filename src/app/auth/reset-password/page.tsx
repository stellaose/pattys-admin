"use client";
import React from "react";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import { IoLockClosedOutline } from "react-icons/io5";
import { GoArrowLeft } from "react-icons/go";
import { AuthLayout } from "#components/layouts";
import { CustomInput, SubmitButton, useNotify } from "#components/general";
import { useAppDispatch } from "#store/hook";
import { setAppKey } from "#/store/slice/app";
import { authBackLink, authLabel } from "#/styles/auth";
import { confirmPasswordRule, passwordRule } from "#/utils/messages";

const ResetPassword = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { Notify } = useNotify();

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const isFormInvalid = !values?.password || !values?.confirm_password;

  const onResetPassword = () => {
    dispatch(setAppKey({ key: "isForgotPassword", value: false }));
    dispatch(setAppKey({ key: "request", value: undefined }));
    Notify("Your password has been reset. Log in to continue.", true);
    router.replace("/auth/login");
  };

  return (
    <AuthLayout
      title="New password"
      headline="Reset password"
      description="Your e-mail has been verified. Choose a new password to secure your admin account."
    >
      <Form
        className="flex flex-col gap-y-4"
        requiredMark={false}
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onResetPassword}
      >
        <CustomInput
          name="password"
          type="password"
          label={
            <p className={authLabel}>
              New password <span className="text-red">*</span>
            </p>
          }
          placeholder="Enter a new password"
          prefix={<IoLockClosedOutline size={24} color="#77767D" />}
          rules={passwordRule}
          onChange={(e) => form.setFieldValue("password", e.target.value)}
        />

        <CustomInput
          name="confirm_password"
          type="password"
          label={
            <p className={authLabel}>
              Confirm password <span className="text-red">*</span>
            </p>
          }
          placeholder="Re-enter the new password"
          prefix={<IoLockClosedOutline size={24} color="#77767D" />}
          rules={confirmPasswordRule}
          onChange={(e) =>
            form.setFieldValue("confirm_password", e.target.value)
          }
        />

        <SubmitButton
          title="Reset password"
          bgVariant="secondary"
          className="!w-full mt-4"
          disabled={isFormInvalid}
        />

        <p className={authBackLink} onClick={() => router.push("/auth/login")}>
          <GoArrowLeft size={16} /> Back to login
        </p>
      </Form>
    </AuthLayout>
  );
};

export default ResetPassword;
