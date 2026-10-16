"use client";
import React from "react";
import { Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { AuthLayout } from "#components/layouts";
import { SubmitButton, useNotify } from "#components/general";
import { useAppDispatch, useAppSelector } from "#store/hook";
import { setAppKey } from "#/store/slice/app";
import { authBackLink, authHelperText, authLink } from "#/styles/auth";
import { otpRule } from "#/utils/messages";

const VerifyOtp = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { Notify } = useNotify();

  const request = useAppSelector((state) => state.app.request);
  const email = request?.email;

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const onVerifyOtp = ({ code }: { code: string }) => {
    dispatch(setAppKey({ key: "request", value: { ...request, code } }));
    router.push("/auth/reset-password");
  };

  const onResendOtp = () => {
    form.resetFields();
    Notify(`A new code has been sent to ${email ?? "your e-mail"}`, true);
  };

  return (
    <AuthLayout
      title="Verification"
      headline="Check your inbox"
      description={`We've sent a 6-digit code to ${email ?? "your e-mail"}. Enter it below to continue.`}
    >
      <Form
        className="flex flex-col gap-y-4"
        requiredMark={false}
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onVerifyOtp}
      >
        <Form.Item name="code" rules={otpRule}>
          <Input.OTP length={6} mask="●" />
        </Form.Item>

        <SubmitButton
          title="Verify code"
          bgVariant="secondary"
          className="!w-full mt-4"
          disabled={values?.code?.length !== 6}
        />

        <p className={`${authHelperText} mt-4`}>
          Didn&apos;t receive it?{" "}
          <span className={authLink} onClick={onResendOtp}>
            Resend code
          </span>
        </p>

        <p
          className={authBackLink}
          onClick={() => router.push("/auth/forgot-password")}
        >
          <GoArrowLeft size={16} /> Change e-mail address
        </p>
      </Form>
    </AuthLayout>
  );
};

export default VerifyOtp;
