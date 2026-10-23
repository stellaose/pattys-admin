"use client";
import React from "react";
import { Avatar, Form, Skeleton } from "antd";
import { IoLockClosedOutline } from "react-icons/io5";
import { useGetDataQuery, usePatchDataMutation } from "#/store";
import { endpoints } from "#/model/endpoints";
import { AdminAccount } from "#services/types";
import {
  CustomInput,
  SubmitButton,
  useNotify,
} from "#components/general";
import { LoadError } from "#components/elements/dashboard/ChartCard";
import { formatDate, fullName, StatusTag } from "#components/elements/admin";
import { chartCard, chartSubtitle, chartTitle } from "#/styles/dashboard";
import { authLabel } from "#/styles/auth";
import {
  confirmPasswordRule,
  currentPasswordRule,
  passwordRule,
} from "#/utils/messages";

const Detail: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col gap-0.5">
    <dt className="text-xs font-arial text-grey-200">{label}</dt>
    <dd className="text-sm font-arial text-black-200">{children || "—"}</dd>
  </div>
);

type PasswordForm = {
  old_password: string;
  password: string;
  confirm_password: string;
};

const ProfilePage = () => {
  const { Notify } = useNotify();
  const { data, isLoading, isError, refetch } = useGetDataQuery({
    getUrl: endpoints.admin.profile,
  });
  const admin = data?.admin as AdminAccount | undefined;

  const [form] = Form.useForm<PasswordForm>();
  const values = Form.useWatch([], form);
  const [patchData, patchResponse] = usePatchDataMutation();

  const onChangePassword = async ({ old_password, password }: PasswordForm) => {
    try {
      const response: any = await patchData({
        patchUrl: endpoints.auth.changePassword,
        request: { old_password, password },
      });
      if (response && "data" in response) {
        Notify(response?.data?.message, true);
        form.resetFields();
      } else {
        Notify(
          response?.error?.data?.message ||
            "Something went wrong. Please try later",
          false,
        );
      }
    } catch (error: any) {
      Notify(error?.message || "Something went wrong. Please try later", false);
    }
  };

  const isFormIncomplete =
    !values?.old_password || !values?.password || !values?.confirm_password;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <section
        className={`${chartCard} xl:col-span-3`}
        aria-labelledby="profile-heading"
      >
        {isError ? (
          <LoadError what="your profile" onRetry={refetch} />
        ) : isLoading || !admin ? (
          <Skeleton active avatar paragraph={{ rows: 5 }} />
        ) : (
          <>
            <div className="mb-6 flex items-center gap-4">
              <Avatar
                size={64}
                className="!bg-lilac-100 !text-24 !font-bold !text-purple-300"
              >
                {fullName(admin).charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <h2 id="profile-heading" className={chartTitle}>
                  {fullName(admin)}
                </h2>
                <p className="flex items-center gap-2 text-sm font-arial text-grey-200">
                  {admin.adminRole?.name ?? admin.role ?? "Administrator"}
                  <StatusTag status={admin.status} />
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <Detail label="E-mail">{admin.email}</Detail>
              <Detail label="Phone number">{admin.phone_number}</Detail>
              <Detail label="First name">{admin.first_name}</Detail>
              <Detail label="Last name">{admin.last_name}</Detail>
              <Detail label="Middle name">{admin.middle_name}</Detail>
              <Detail label="Gender">
                {admin.gender && (
                  <span className="capitalize">{admin.gender}</span>
                )}
              </Detail>
              <Detail label="Member since">{formatDate(admin.createdAt)}</Detail>
            </dl>
          </>
        )}
      </section>

      <section
        className={`${chartCard} xl:col-span-2`}
        aria-labelledby="password-heading"
      >
        <h2 id="password-heading" className={chartTitle}>
          Change password
        </h2>
        <p className={`${chartSubtitle} mb-4`}>
          You&apos;ll use the new password the next time you log in.
        </p>
        <Form
          className="flex flex-col gap-y-4"
          requiredMark={false}
          layout="vertical"
          autoComplete="off"
          form={form}
          onFinish={onChangePassword}
        >
          <CustomInput
            name="old_password"
            type="password"
            label={<p className={authLabel}>Current password</p>}
            placeholder="Enter your current password"
            prefix={<IoLockClosedOutline size={20} color="#77767D" />}
            rules={currentPasswordRule}
            onChange={(e) => form.setFieldValue("old_password", e.target.value)}
          />
          <CustomInput
            name="password"
            type="password"
            label={<p className={authLabel}>New password</p>}
            placeholder="Enter a new password"
            prefix={<IoLockClosedOutline size={20} color="#77767D" />}
            rules={passwordRule}
            onChange={(e) => form.setFieldValue("password", e.target.value)}
          />
          <CustomInput
            name="confirm_password"
            type="password"
            label={<p className={authLabel}>Confirm new password</p>}
            placeholder="Re-enter the new password"
            prefix={<IoLockClosedOutline size={20} color="#77767D" />}
            rules={confirmPasswordRule}
            onChange={(e) =>
              form.setFieldValue("confirm_password", e.target.value)
            }
          />
          <SubmitButton
            title="Update password"
            bgVariant="secondary"
            className="!w-full mt-2"
            loading={patchResponse.isLoading}
            disabled={isFormIncomplete}
          />
        </Form>
      </section>
    </div>
  );
};

export default ProfilePage;
