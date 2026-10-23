/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import { Form } from "antd";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";
import { AuthLayout } from "#components/layouts";
import { CustomInput, SubmitButton } from "#components/general";
import { useRouter } from "next/navigation";
import { useAuth, useFieldRequest } from "#/hooks";
import { authLabel, authLink } from "#/styles/auth";
import { emailRule, loginPasswordRule } from "#/utils/messages";
import { emailPlaceholder, passwordPlaceholder } from "#/utils/placeholder";

const Login = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const { setRequestField } = useFieldRequest();

  const isFormInvalid = !values?.email || !values?.password;

  const { onLogin, postAuthResponse } = useAuth();

  useEffect(() => {
    if (postAuthResponse.isSuccess) {
      form.resetFields();
    }
  }, [postAuthResponse.isSuccess]);

  return (
    <AuthLayout
      title="Admin access"
      headline="Welcome back"
      description="Log in to manage the Pattys Admin Dashboard"
    >
      <Form
        className="flex flex-col gap-y-4"
        requiredMark={false}
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onLogin}
      >
        <CustomInput
          name="email"
          type="email"
          label={
            <p className={authLabel}>
              E-mail <span className="text-red">*</span>
            </p>
          }
          placeholder={emailPlaceholder}
          prefix={<MdOutlineMailOutline size={24} color="#77767D" />}
          rules={emailRule}
          onChange={(e) => {
            form.setFieldValue("email", e.target.value);
            setRequestField("email", e.target.value);
          }}
        />

        <CustomInput
          name="password"
          type="password"
          label={
            <p className={authLabel}>
              Password <span className="text-red">*</span>
            </p>
          }
          placeholder={passwordPlaceholder}
          prefix={
            <IoLockClosedOutline size={24} color="#77767D" />
          }
          rules={loginPasswordRule}
          onChange={(e) => {
            form.setFieldValue("password", e.target.value);
            setRequestField("password", e.target.value);
          }}
        />
        <p className="flex justify-end -mt-2">
          <span
            className={authLink}
            onClick={() => router.push("/auth/forgot-password")}
          >
            Forgot your password?
          </span>
        </p>

        <SubmitButton
          title="Log in"
          bgVariant="secondary"
          className="!w-full mt-4"
          loading={postAuthResponse.isLoading}
          disabled={isFormInvalid}
        />
      </Form>
    </AuthLayout>
  );
};

export default Login;
