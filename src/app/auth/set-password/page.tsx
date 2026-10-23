"use client";
import React from "react";
import { Form } from "antd";
import { useRouter } from "next/navigation";
import { IoLockClosedOutline } from "react-icons/io5";
import { GoArrowLeft } from "react-icons/go";
import { AuthLayout } from "#components/layouts";
import { CustomInput, SubmitButton } from "#components/general";
import { useAuth } from "#/hooks";
import { authBackLink, authLabel } from "#/styles/auth";
import { confirmPasswordRule, passwordRule } from "#/utils/messages";

const SetPassword = () => {
  const router = useRouter();

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const isFormInvalid = !values?.password || !values?.confirm_password;

  const { onCreatePassword, postAuthResponse } = useAuth();

  return (
    <AuthLayout
      title="Step 2 of 3 · Account setup"
      headline="Set your password"
      description="Create a strong password you'll use to log in to the Pattys admin console."
    >
      <Form
        className="flex flex-col gap-y-4"
        requiredMark={false}
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onCreatePassword}
      >
        <CustomInput
          name="password"
          type="password"
          label={
            <p className={authLabel}>
              Password <span className="text-red">*</span>
            </p>
          }
          placeholder="Create a password"
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
          placeholder="Re-enter the password"
          prefix={<IoLockClosedOutline size={24} color="#77767D" />}
          rules={confirmPasswordRule}
          onChange={(e) =>
            form.setFieldValue("confirm_password", e.target.value)
          }
        />

        <SubmitButton
          title="Continue"
          bgVariant="secondary"
          className="!w-full mt-4"
          loading={postAuthResponse.isLoading}
          disabled={isFormInvalid}
        />

        <p className={authBackLink} onClick={() => router.push("/auth/login")}>
          <GoArrowLeft size={16} /> Back to login
        </p>
      </Form>
    </AuthLayout>
  );
};

export default SetPassword;
