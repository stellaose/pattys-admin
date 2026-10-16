/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Form, Input, InputProps } from "antd";
import { Rule } from "antd/es/form";
import { RiEyeCloseLine } from "react-icons/ri";
import { NigeriaFlag } from "#assets/images";
import Image from "next/image";

type AppInputProps = InputProps & {
  name: string;
  label: React.ReactNode;
  placeholder: string;
  type?: "text" | "password" | "email" | "tel" | "phoneNo";
  value?: string | number;
  rules?: Rule[];
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export const CustomInput: React.FC<AppInputProps> = ({
  name,
  placeholder,
  rules,
  type = "text",
  label,
  value,
  onChange,
  required = false,
  ...inputRest
}) => {
  const className = "!h-12.5 text-base";

  return (
    <Form.Item name={name} label={label} rules={rules} required={required}>
      {type === "text" || type === "email" || type === "tel" ? (
        <Input
          {...inputRest}
          placeholder={placeholder}
          type={type}
          className={className}
          onChange={onChange}
        />
      ) : type === "phoneNo" ? (
        <div className="flex items-center gap-x-4">
          <Image
            src={NigeriaFlag}
            alt=""
            className="h-8 w-auto"
            loading="eager"
          />{" "}
          <Input
            placeholder="Phone Number"
            required
            type="tel"
            maxLength={11}
            className="!h-12.5 text-base"
            value={value}
            onChange={onChange}
          />
        </div>
      ) : (
        <Input.Password
          {...inputRest}
          placeholder={placeholder}
          className={className}
          onChange={onChange}
          iconRender={(_visible) => (
            <RiEyeCloseLine size={24} color="#969191" />
          )}
        />
      )}
    </Form.Item>
  );
};
