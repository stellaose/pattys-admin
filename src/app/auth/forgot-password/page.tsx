"use client";
import React from "react";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import { MdOutlineMailOutline } from "react-icons/md";
import { GoArrowLeft } from "react-icons/go";
import { AuthLayout } from "#components/layouts";
import { CustomInput, SubmitButton } from "#components/general";
import { useAuth } from "#/hooks";
import { authBackLink, authLabel } from "#/styles/auth";
import { emailRule } from "#/utils/messages";

const ForgotPassword = () => {
  const router = useRouter();

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const { onForgotPassword, postAuthResponse } = useAuth();

  return (
    <AuthLayout
      title="Password recovery"
      headline="Forgot password?"
      description="Enter the e-mail linked to your admin account and we'll send you a 6-digit verification code."
    >
      <Form
        className="flex flex-col gap-y-4"
        requiredMark={false}
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onForgotPassword}
      >
        <CustomInput
          name="email"
          type="email"
          label={
            <p className={authLabel}>
              E-mail <span className="text-red">*</span>
            </p>
          }
          placeholder="admin@pattys.com"
          prefix={<MdOutlineMailOutline size={24} color="#77767D" />}
          rules={emailRule}
          onChange={(e) => form.setFieldValue("email", e.target.value)}
        />

        <SubmitButton
          title="Send code"
          bgVariant="secondary"
          className="!w-full mt-4"
          loading={postAuthResponse.isLoading}
          disabled={!values?.email}
        />

        <p className={authBackLink} onClick={() => router.push("/auth/login")}>
          <GoArrowLeft size={16} /> Back to login
        </p>
      </Form>
    </AuthLayout>
  );
};

export default ForgotPassword;
