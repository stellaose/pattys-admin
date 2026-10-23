/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import { Avatar, Form } from "antd";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LuUser } from "react-icons/lu";
import { RiUser6Line } from "react-icons/ri";
import { HiOutlineUsers } from "react-icons/hi2";
import { GoArrowLeft } from "react-icons/go";
import { AuthLayout } from "#components/layouts";
import { CustomInput, Select, SubmitButton } from "#components/general";
import { useAuth, useFieldRequest } from "#/hooks";
import { useAppSelector } from "#store/hook";
import {
  authBackLink,
  authFormHeadline,
  authFormSubheading,
  authFormTitle,
  authHelperText,
  authLabel,
  authPhoneLabel,
  inputText,
  signupFormBody,
} from "#/styles/auth";
import {
  firstNameRule,
  genderOptions,
  genderRule,
  lastNameRule,
  phoneNumberRule,
} from "#/utils/messages";
import {
  firstNamePlaceholder,
  genderPlaceholder,
  lastNamePlaceholder,
  phoneNumberPlaceholder,
} from "#/utils/placeholder";

const CompleteProfile = () => {
  const router = useRouter();
  const email = useAppSelector(
    (state) => state.app.user?.email ?? state.app.request?.email,
  );

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const { setRequestField } = useFieldRequest();

  const isFormInvalid =
    !values?.first_name?.trim() ||
    !values?.last_name?.trim() ||
    !values?.phone_number ||
    !values?.gender;

  const initials = [values?.first_name, values?.last_name]
    .map((name) => name?.trim().charAt(0).toUpperCase())
    .filter(Boolean)
    .join("");

  const { onCompleteProfile, patchResponse } = useAuth();

  useEffect(() => {
    if (patchResponse.isSuccess) {
      form.resetFields();
    }
  }, [patchResponse.isSuccess]);

  return (
    <AuthLayout>
      <Form
        className="!mt-14 flex flex-col gap-y-4"
        requiredMark={false}
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={onCompleteProfile}
      >
        <div className="mb-4">
          <p className={authFormTitle}>account setup</p>
          <h3 className={authFormHeadline}>Complete your profile</h3>
          <p className={authFormSubheading}>
            Tell us a little about yourself so writers and other admins know
            who they&apos;re working with
          </p>
        </div>

        <div className="flex items-center gap-4 mb-2">
          <Avatar size={64} className="!bg-purple-200 !text-20 !font-bold">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={initials || "placeholder"}
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
              >
                {initials || <LuUser size={28} />}
              </motion.span>
            </AnimatePresence>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-bold font-arial text-black-200">
              {email ?? "Your admin account"}
            </p>
            <p className={`${authHelperText} !text-left`}>Administrator</p>
          </div>
        </div>

        <div className={signupFormBody}>
          <div className={inputText}>
            <CustomInput
              name="first_name"
              label={
                <p className={authLabel}>
                  First Name <span className="text-red">*</span>
                </p>
              }
              placeholder={firstNamePlaceholder}
              prefix={<RiUser6Line size={24} color="#77767D" />}
              rules={firstNameRule}
              onChange={(e) => {
                form.setFieldValue("first_name", e.target.value);
                setRequestField("first_name", e.target.value);
              }}
            />
          </div>
          <div className={inputText}>
            <CustomInput
              name="last_name"
              label={
                <p className={authLabel}>
                  Last Name <span className="text-red">*</span>
                </p>
              }
              placeholder={lastNamePlaceholder}
              prefix={<RiUser6Line size={24} color="#77767D" />}
              rules={lastNameRule}
              onChange={(e) => {
                form.setFieldValue("last_name", e.target.value);
                setRequestField("last_name", e.target.value);
              }}
            />
          </div>
        </div>

        <div className={signupFormBody}>
          <div className={inputText}>
            <CustomInput
              name="middle_name"
              label={<p className={authLabel}>Middle Name</p>}
              placeholder="Enter middle name (optional)"
              prefix={<RiUser6Line size={24} color="#77767D" />}
              onChange={(e) => {
                form.setFieldValue("middle_name", e.target.value);
                setRequestField("middle_name", e.target.value);
              }}
            />
          </div>
          <div className={inputText}>
            <Select
              name="gender"
              label={
                <p className={authLabel}>
                  Gender <span className="text-red">*</span>
                </p>
              }
              prefix={<HiOutlineUsers size={24} color="#77767D" />}
              placeholder={genderPlaceholder}
              options={genderOptions}
              rules={genderRule}
              onChange={(value) => {
                form.setFieldValue("gender", value);
                setRequestField("gender", value);
              }}
            />
          </div>
        </div>

        <CustomInput
          name="phone_number"
          type="phoneNo"
          label={
            <p className={authPhoneLabel}>
              Phone Number <span className="text-red">*</span>
            </p>
          }
          placeholder={phoneNumberPlaceholder}
          value={values?.phone_number?.replace(/[^0-9]/g, "")}
          rules={phoneNumberRule}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            form.setFieldValue("phone_number", e.target.value);
            setRequestField(
              "phone_number",
              e.target.value?.replace(/[^0-9]/g, ""),
            );
          }}
        />

        <div className="mt-4.75">
          <SubmitButton
            title="Finish setup"
            bgVariant="secondary"
            className="!w-full"
            loading={patchResponse.isLoading}
            disabled={isFormInvalid}
          />

          <p
            className={authBackLink}
            onClick={() => router.push("/auth/login")}
          >
            <GoArrowLeft size={16} /> Back to login
          </p>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default CompleteProfile;
