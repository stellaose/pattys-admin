import React from "react";
import { Form, Input } from "antd";
import { SubmitButton } from "@components/Elements";
import { useAuth } from "@/hooks";

export const Login: React.FC = () => {
  const [form] = Form.useForm();
  const values: any = Form.useWatch([], form);

  const { login, postDataResult } = useAuth();

  const handleFinish = (value: object | any) => {
    const payload = {
      email: value.email,
      password: value.password,
    };

    login(payload);
  };
  return (
    <div className="px-6">
      <p className="text-3xl font-bold text-center">Welcome back!</p>
      <p className="text-center text-sm font-medium text-black-100 mb-6">
        Please log in
      </p>

      <Form
        form={form}
        requiredMark={false}
        layout="vertical"
        onFinish={() => {
          handleFinish(values);
        }}
      >
        <Form.Item
          label={<p className="font-rale font-medium">Email Address</p>}
          name="email"
          rules={[{ required: true, message: "Email is required" }]}
        >
          <Input
            className="h-10 font-medium placeholder:font-medium"
            placeholder="admin@pattys.co"
            type="email"
          />
        </Form.Item>

        <Form.Item
          label={<p className="font-rale font-medium">Password</p>}
          name="password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password
            className="h-10"
            placeholder="••••••••••••••••"
            type="password"
          />
        </Form.Item>

        <SubmitButton
          text="Login"
          className="w-full mt-6"
          htmlType="submit"
          isLoading={postDataResult.isLoading}
        />
      </Form>
    </div>
  );
};
