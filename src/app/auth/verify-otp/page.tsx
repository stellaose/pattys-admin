"use client";
import React from "react";
import { Form, Input, Spin } from "antd";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { AuthLayout } from "#components/layouts";
import { SubmitButton } from "#components/general";
import { useAuth } from "#/hooks";
import { useAppSelector } from "#store/hook";
import { authBackLink, authHelperText, authLink } from "#/styles/auth";
import { otpRule } from "#/utils/messages";

const VerifyOtp = () => {
  const router = useRouter();

  const email = useAppSelector((state) => state.app.request?.email);
  const isForgotPassword = useAppSelector(
    (state) => state.app.isForgotPassword,
  );

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  // Two instances so the resend spinner and the submit spinner are independent
  const { onVerifyLogin, onVerifyForgotPassword, postAuthResponse } = useAuth();
  const { onResendOtp, postAuthResponse: resendResponse } = useAuth();

  const onResend = async () => {
    form.resetFields();
    await onResendOtp();
  };

  return (
    <AuthLayout
      title={isForgotPassword ? "Password recovery" : "Login verification"}
      headline="Check your inbox"
      description={`We've sent a 6-digit code to ${email ?? "your e-mail"}. Enter it below to continue.`}
    >
      <Form
        className="flex flex-col gap-y-4"
        requiredMark={false}
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={isForgotPassword ? onVerifyForgotPassword : onVerifyLogin}
      >
        <Form.Item name="code" rules={otpRule}>
          <Input.OTP length={6} mask="●" />
        </Form.Item>

        <SubmitButton
          title="Verify code"
          bgVariant="secondary"
          className="!w-full mt-4"
          loading={postAuthResponse.isLoading}
          disabled={values?.code?.length !== 6}
        />

        <p className={`${authHelperText} mt-4`}>
          Didn&apos;t receive it?{" "}
          {resendResponse.isLoading ? (
            <Spin size="small" />
          ) : (
            <span className={authLink} onClick={onResend}>
              Resend code
            </span>
          )}
        </p>

        {isForgotPassword ? (
          <p
            className={authBackLink}
            onClick={() => router.push("/auth/forgot-password")}
          >
            <GoArrowLeft size={16} /> Change e-mail address
          </p>
        ) : (
          <p
            className={authBackLink}
            onClick={() => router.push("/auth/login")}
          >
            <GoArrowLeft size={16} /> Back to login
          </p>
        )}
      </Form>
    </AuthLayout>
  );
};

export default VerifyOtp;
