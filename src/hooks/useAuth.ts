/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "#store/hook";
import {
  setAllAppKeys,
  usePatchDataMutation,
  usePostAuthMutation,
  usePostDataMutation,
} from "#/store";
import { useNotify } from "#/components/general";
import { endpoints } from "#/model/endpoints";
import { handleLogout } from "#/store/utils/logout";

export type ProfilePayload = {
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone_number: string;
  gender: "male" | "female";
};

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.app);

  const { Notify } = useNotify();
  const router = useRouter();

  const [postAuth, postAuthResponse] = usePostAuthMutation();
  const [postData, postResponse] = usePostDataMutation();
  const [patchData, patchResponse] = usePatchDataMutation();

  const onLogin = useCallback(async () => {
    const { email, password } = state.request ?? {};

    try {
      const response: any = await postAuth({
        ...state,
        url: endpoints.auth.login,
        request: { email, password },
      });

      if (response && "data" in response) {
        Notify(response?.data?.message, true);
        dispatch(
          setAllAppKeys({
            ...state,
            isForgotPassword: false,
            adminId: response?.data?.admin?.adminId ?? "",
            request: { email, password },
          }),
        );
        router.push("/auth/verify-otp");
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
  }, [Notify, state, postAuth]);

  const onVerifyLogin = useCallback(
    async ({ code }: { code: string }) => {
      try {
        const response: any = await postAuth({
          ...state,
          url: endpoints.auth.verifyLogin,
          request: {
            email: state.request?.email,
            code: Number(code),
          },
        });

        if (response && "data" in response) {
          const admin = response?.data?.admin;
          const isSetUp =
            admin?.is_created_password && admin?.is_completed_profile;

          sessionStorage.setItem(
            `${process.env.NEXT_PUBLIC_TOKEN}`,
            response?.data?.token,
          );
          Notify(response?.data?.message, true);
          dispatch(
            setAllAppKeys({
              ...state,
              request: isSetUp ? undefined : { email: state.request?.email },
              isLoggedIn: Boolean(isSetUp),
              adminId: admin?.adminId ?? state.adminId,
              user: admin,
            }),
          );

          if (!admin?.is_created_password) {
            router.push("/auth/set-password");
          } else if (!admin?.is_completed_profile) {
            router.push("/auth/complete-profile");
          } else {
            router.replace("/dashboard");
          }
        } else {
          Notify(
            response?.error?.data?.message ||
              "Something went wrong. Please try later",
            false,
          );
        }
      } catch (error: any) {
        Notify(
          error?.message || "Something went wrong. Please try later",
          false,
        );
      }
    },
    [Notify, state, postAuth],
  );

  const onForgotPassword = useCallback(
    async ({ email }: { email: string }) => {
      try {
        const response: any = await postAuth({
          ...state,
          url: endpoints.auth.forgotPassword,
          request: { email },
        });

        if (response && "data" in response) {
          Notify(response?.data?.message, true);
          dispatch(
            setAllAppKeys({
              ...state,
              isForgotPassword: true,
              adminId: response?.data?.admin?.adminId ?? "",
              request: { email },
            }),
          );
          router.push("/auth/verify-otp");
        } else {
          Notify(
            response?.error?.data?.message ||
              "Something went wrong. Please try later",
            false,
          );
        }
      } catch (error: any) {
        Notify(
          error?.message || "Something went wrong. Please try later",
          false,
        );
      }
    },
    [Notify, state, postAuth],
  );

  const onVerifyForgotPassword = useCallback(
    async ({ code }: { code: string }) => {
      try {
        const response: any = await postAuth({
          ...state,
          url: endpoints.auth.verifyForgotPassword,
          request: {
            email: state.request?.email,
            code: Number(code),
          },
        });

        if (response && "data" in response) {
          Notify(response?.data?.message, true);
          dispatch(
            setAllAppKeys({
              ...state,
              request: {
                email: state.request?.email,
                passwordResetToken: response?.data?.passwordResetToken,
              },
            }),
          );
          router.push("/auth/reset-password");
        } else {
          Notify(
            response?.error?.data?.message ||
              "Something went wrong. Please try later",
            false,
          );
        }
      } catch (error: any) {
        Notify(
          error?.message || "Something went wrong. Please try later",
          false,
        );
      }
    },
    [Notify, state, postAuth],
  );

  const onResendOtp = useCallback(async () => {
    const { email, password } = state.request ?? {};

    try {
      const response: any = await postAuth({
        ...state,
        url: state.isForgotPassword
          ? endpoints.auth.forgotPassword
          : endpoints.auth.login,
        request: state.isForgotPassword ? { email } : { email, password },
      });

      if (response && "data" in response) {
        Notify(response?.data?.message, true);
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
  }, [Notify, state, postAuth]);

  const onResetPassword = useCallback(
    async ({ password }: { password: string }) => {
      try {
        const response: any = await postAuth({
          ...state,
          url: endpoints.auth.resetPassword,
          request: {
            passwordResetToken: state.request?.passwordResetToken,
            password,
          },
        });

        if (response && "data" in response) {
          Notify(response?.data?.message, true);
          dispatch(
            setAllAppKeys({
              ...state,
              request: undefined,
              isForgotPassword: false,
            }),
          );
          router.replace("/auth/login");
        } else {
          Notify(
            response?.error?.data?.message ||
              "Something went wrong. Please try later",
            false,
          );
        }
      } catch (error: any) {
        Notify(
          error?.message || "Something went wrong. Please try later",
          false,
        );
      }
    },
    [Notify, state, postAuth],
  );

  const onCreatePassword = useCallback(
    async ({ password }: { password: string }) => {
      try {
        const response: any = await postAuth({
          ...state,
          url: endpoints.auth.createPassword,
          request: { password },
        });

        if (response && "data" in response) {
          const admin = { ...state.user, ...response?.data?.admin };

          Notify(response?.data?.message, true);
          dispatch(
            setAllAppKeys({
              ...state,
              user: admin,
              isLoggedIn: Boolean(admin.is_completed_profile),
              request: admin.is_completed_profile ? undefined : state.request,
            }),
          );

          if (!admin.is_completed_profile) {
            router.push("/auth/complete-profile");
          } else {
            router.replace("/dashboard");
          }
        } else {
          Notify(
            response?.error?.data?.message ||
              "Something went wrong. Please try later",
            false,
          );
        }
      } catch (error: any) {
        Notify(
          error?.message || "Something went wrong. Please try later",
          false,
        );
      }
    },
    [Notify, state, postAuth],
  );

  const onCompleteProfile = useCallback(async () => {
    const { first_name, last_name, middle_name, phone_number, gender } =
      state.request ?? {};

    try {
      const response: any = await patchData({
        patchUrl: endpoints.admin.completeProfile,
        request: {
          first_name: first_name?.trim(),
          last_name: last_name?.trim(),
          middle_name: middle_name?.trim() || undefined,
          phone_number,
          gender,
        } as ProfilePayload,
      });

      if (response && "data" in response) {
        Notify(response?.data?.message, true);
        dispatch(
          setAllAppKeys({
            ...state,
            user: response?.data?.admin,
            isLoggedIn: true,
            request: undefined,
          }),
        );
        router.replace("/dashboard");
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
  }, [Notify, state, patchData]);

  const onLogout = useCallback(async () => {
    try {
      await postData({ postUrl: endpoints.auth.logout });
    } finally {
      handleLogout();
      router.replace("/auth/login");
    }
  }, [postData]);

  return {
    onLogin,
    onVerifyLogin,
    onForgotPassword,
    onVerifyForgotPassword,
    onResendOtp,
    onResetPassword,
    onCreatePassword,
    onCompleteProfile,
    onLogout,
    postAuthResponse,
    postResponse,
    patchResponse,
  };
};
