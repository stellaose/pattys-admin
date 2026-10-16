import React from "react";
import { Select as AntSelect, Form, SelectProps } from "antd";
import { Rule } from "antd/es/form";

interface AppSelectProps extends SelectProps {
  name: string;
  label: React.ReactNode;
  placeholder: string;
  rules?: Rule[];
}

export const Select: React.FC<AppSelectProps> = ({
  name,
  placeholder,
  rules,
  label,
  ...selectRest
}) => {
  const className = "!h-12.5 text-base";

  return (
    <>
      <Form.Item name={name} label={label} rules={rules}>
        <AntSelect
          {...selectRest}
          placeholder={placeholder}
          className={className}
        />
      </Form.Item>
    </>
  );
};
