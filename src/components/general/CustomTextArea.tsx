import React from "react";
import { Form, Input } from "antd";
import { Rule } from "antd/es/form";

type AppInputProps = {
  name: string;
  label: React.ReactNode;
  placeholder: string;
  rules?: Rule[];
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  required?: boolean;
  className?: string;
};

export const CustomTextArea: React.FC<AppInputProps> = ({
  name,
  placeholder,
  rules,
  label,
  onChange,
  required = false,
  className,
  ...inputRest
}) => {
  const classNames = "!resize-none text-base !py-2";

  return (
    <Form.Item name={name} label={label} rules={rules} required={required}>
      <Input.TextArea
        {...inputRest}
        placeholder={placeholder}
        className={`${classNames} ${className}`}
        onChange={onChange}
        rows={3}
      />
    </Form.Item>
  );
};
