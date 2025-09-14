import React from "react";
import {Form, Input} from 'antd'

export const Login: React.FC = () => {
  return (
    <div>
      <p className="text-3xl font-bold text-center">Welcome back!</p>
      <p className="text-center text-sm font-medium text-black-100">
        Please log in
      </p>
      
      <Form>
        <Form.Item >
          <Input/>
        </Form.Item>
      </Form>
    </div>
  );
};
