"use client";
import React from "react";
import { Form } from "antd";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";
import { AuthLayout } from "#components/layouts";
import { CustomInput, SubmitButton } from "#components/general";
import { useRouter } from "next/navigation";
import { authLabel, authLink } from "#/styles/auth";

const Login = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const isFormInvalid = !values?.email || !values?.password;

  const onLogin = (payload: { email: string; password: string }) => {
    console.log(payload);
  };

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
          placeholder="admin@pattys.com"
          prefix={<MdOutlineMailOutline size={24} color="#77767D" />}
          rules={[
            { required: true, type: "email", message: "Enter a valid e-mail" },
          ]}
          onChange={(e) => form.setFieldValue("email", e.target.value)}
        />

        <CustomInput
          name="password"
          type="password"
          label={
            <p className={authLabel}>
              Password <span className="text-red">*</span>
            </p>
          }
          placeholder="Enter your password"
          prefix={<IoLockClosedOutline size={24} color="#77767D" />}
          rules={[{ required: true, message: "Enter your password" }]}
          onChange={(e) => form.setFieldValue("password", e.target.value)}
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
          disabled={isFormInvalid}
        />
      </Form>
    </AuthLayout>
  );
};

export default Login;
