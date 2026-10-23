import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "#test/utils/user";
import VerifyOtp from "#/app/auth/verify-otp/page";
import { mockRouter } from "#test/mocks/navigation";
import { mockApi } from "#test/utils/api";
import { renderWithProviders, resetStore, store } from "#test/utils/render";

const TOKEN_KEY = `${process.env.NEXT_PUBLIC_TOKEN}`;

const submitButton = () =>
  screen.getByRole("button", { name: /verify code/i });

// # antd's OTP field renders one masked input per digit and moves focus as you
// ^ type, so click the first box and keep typing from wherever focus lands
const typeCode = async (digits: string) => {
  const firstBox = document.querySelector<HTMLInputElement>(".ant-otp input");
  if (document.activeElement?.closest(".ant-otp") === null) {
    await userEvent.click(firstBox!);
  }
  await userEvent.keyboard(digits);
};

const submitCode = async (code = "654321") => {
  await typeCode(code);
  await waitFor(() => expect(submitButton()).toBeEnabled());
  await userEvent.click(submitButton());
};

const setUpAdmin = {
  adminId: "admin-1",
  first_name: "Ada",
  last_name: "Lovelace",
  email: "ada@example.com",
  is_created_password: true,
  is_completed_profile: true,
};

describe("Verify OTP page", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("during login", () => {
    beforeEach(() =>
      resetStore({
        isForgotPassword: false,
        request: { email: "ada@example.com", password: "Secret@123" },
      }),
    );

    // * Shows which e-mail address received the verification code.
    it("tells the admin where the code was sent", () => {
      renderWithProviders(<VerifyOtp />);

      expect(screen.getByText(/ada@example\.com/)).toBeInTheDocument();
    });

    // ~ Enables verification only after all six code digits have been entered.
    it("keeps the submit button disabled until all six digits are entered", async () => {
      renderWithProviders(<VerifyOtp />);

      expect(submitButton()).toBeDisabled();

      await typeCode("123");
      expect(submitButton()).toBeDisabled();

      await typeCode("456");
      await waitFor(() => expect(submitButton()).toBeEnabled());
    });

    // ` Saves the session token and opens the dashboard for a fully set-up admin.
    it("logs a set-up admin in and opens the dashboard", async () => {
      const calls = mockApi({
        "POST /auth/verify-login": {
          body: { message: "Login successful", token: "jwt-1", admin: setUpAdmin },
        },
      });
      renderWithProviders(<VerifyOtp />);

      await submitCode();

      await waitFor(() =>
        expect(mockRouter.replace).toHaveBeenCalledWith("/dashboard"),
      );
      expect(calls[0].body).toEqual({ email: "ada@example.com", code: 654321 });
      expect(sessionStorage.getItem(TOKEN_KEY)).toBe("jwt-1");
      expect(store.getState().app.isLoggedIn).toBe(true);
      expect(store.getState().app.user).toEqual(setUpAdmin);
      expect(store.getState().app.request).toBeUndefined();
    });

    // ^ Sends an invited admin to replace their temporary password first.
    it("sends an invited admin to set a password", async () => {
      mockApi({
        "POST /auth/verify-login": {
          body: {
            message: "Login successful",
            token: "jwt-1",
            admin: {
              ...setUpAdmin,
              is_created_password: false,
              is_completed_profile: false,
            },
          },
        },
      });
      renderWithProviders(<VerifyOtp />);

      await submitCode();

      await waitFor(() =>
        expect(mockRouter.push).toHaveBeenCalledWith("/auth/set-password"),
      );
      expect(store.getState().app.isLoggedIn).toBe(false);
      expect(sessionStorage.getItem(TOKEN_KEY)).toBe("jwt-1");
    });

    // ^ Sends an admin with a password but no profile to complete it.
    it("sends an admin without a profile to complete it", async () => {
      mockApi({
        "POST /auth/verify-login": {
          body: {
            message: "Login successful",
            token: "jwt-1",
            admin: { ...setUpAdmin, is_completed_profile: false },
          },
        },
      });
      renderWithProviders(<VerifyOtp />);

      await submitCode();

      await waitFor(() =>
        expect(mockRouter.push).toHaveBeenCalledWith("/auth/complete-profile"),
      );
      expect(store.getState().app.isLoggedIn).toBe(false);
    });

    // ! Shows the backend's message for a wrong code.
    it("shows the error for a wrong code", async () => {
      mockApi({
        "POST /auth/verify-login": {
          status: 400,
          body: { message: "Invalid verification code" },
        },
      });
      renderWithProviders(<VerifyOtp />);

      await submitCode("111111");

      expect(
        await screen.findByText("Invalid verification code"),
      ).toBeInTheDocument();
      expect(store.getState().app.isLoggedIn).toBe(false);
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    //  % Repeats the login request, since the admin API has no resend route.
    it("resends the code by repeating the login", async () => {
      const calls = mockApi({
        "POST /auth/login": {
          body: { message: "A login code has been sent to your e-mail" },
        },
      });
      renderWithProviders(<VerifyOtp />);

      await userEvent.click(screen.getByText(/resend code/i));

      expect(
        await screen.findByText("A login code has been sent to your e-mail"),
      ).toBeInTheDocument();
      expect(calls[0].body).toEqual({
        email: "ada@example.com",
        password: "Secret@123",
      });
    });

    // Offers a way back to login rather than to the recovery form.
    it("links back to login", async () => {
      renderWithProviders(<VerifyOtp />);

      await userEvent.click(screen.getByText(/back to login/i));

      expect(mockRouter.push).toHaveBeenCalledWith("/auth/login");
    });
  });

  describe("during password recovery", () => {
    beforeEach(() =>
      resetStore({
        isForgotPassword: true,
        request: { email: "ada@example.com" },
      }),
    );

    // & Exchanges the code for a reset token and opens the reset-password page.
    it("keeps the reset token and moves on to reset password", async () => {
      const calls = mockApi({
        "POST /auth/verify-forgot-password": {
          body: {
            message: "Verification successful",
            passwordResetToken: "reset-1",
          },
        },
      });
      renderWithProviders(<VerifyOtp />);

      await submitCode();

      await waitFor(() =>
        expect(mockRouter.push).toHaveBeenCalledWith("/auth/reset-password"),
      );
      expect(calls[0].body).toEqual({ email: "ada@example.com", code: 654321 });
      expect(store.getState().app.request).toEqual({
        email: "ada@example.com",
        passwordResetToken: "reset-1",
      });
    });

    //  % Repeats the forgot-password request to send a new code.
    it("resends the code by repeating the forgot-password request", async () => {
      const calls = mockApi({
        "POST /auth/forgot-password": {
          body: { message: "A reset code has been sent to your e-mail" },
        },
      });
      renderWithProviders(<VerifyOtp />);

      await userEvent.click(screen.getByText(/resend code/i));

      expect(
        await screen.findByText("A reset code has been sent to your e-mail"),
      ).toBeInTheDocument();
      expect(calls[0].body).toEqual({ email: "ada@example.com" });
    });

    // Returns to the recovery form so the admin can change the e-mail address.
    it("goes back to change the e-mail address", async () => {
      renderWithProviders(<VerifyOtp />);

      await userEvent.click(screen.getByText(/change e-mail address/i));

      expect(mockRouter.push).toHaveBeenCalledWith("/auth/forgot-password");
    });
  });
});
