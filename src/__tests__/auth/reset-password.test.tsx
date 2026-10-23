import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "#test/utils/user";
import ResetPassword from "#/app/auth/reset-password/page";
import { mockRouter } from "#test/mocks/navigation";
import { mockApi } from "#test/utils/api";
import { renderWithProviders, resetStore, store } from "#test/utils/render";

const submitButton = () =>
  screen.getByRole("button", { name: /reset password/i });

const fillPasswords = async (password: string, confirm: string) => {
  await userEvent.type(
    screen.getByPlaceholderText("Enter a new password"),
    password,
  );
  await userEvent.type(
    screen.getByPlaceholderText("Re-enter the new password"),
    confirm,
  );
  await waitFor(() => expect(submitButton()).toBeEnabled());
};

describe("Reset password page", () => {
  beforeEach(() => {
    resetStore({
      isForgotPassword: true,
      request: { email: "ada@example.com", passwordResetToken: "reset-1" },
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ? Keeps submission unavailable until both password fields have values.
  it("keeps the submit button disabled until both fields are filled", () => {
    renderWithProviders(<ResetPassword />);

    expect(submitButton()).toBeDisabled();
  });

  // + Rejects a password that does not meet the strength requirements.
  it("rejects a weak password", async () => {
    renderWithProviders(<ResetPassword />);

    await fillPasswords("password", "password");
    await userEvent.click(submitButton());

    expect(
      await screen.findByText(/must contain at least 8 characters/i),
    ).toBeInTheDocument();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  // = Rejects confirmation when it differs from the new password.
  it("rejects passwords that do not match", async () => {
    renderWithProviders(<ResetPassword />);

    await fillPasswords("Secret@123", "Secret@999");
    await userEvent.click(submitButton());

    expect(
      await screen.findByText("Passwords do not match"),
    ).toBeInTheDocument();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  // ; Sends the reset token with the new password, then returns to login.
  it("resets the password and returns to login", async () => {
    const calls = mockApi({
      "POST /auth/reset-password": {
        body: { message: "Password reset successful" },
      },
    });
    renderWithProviders(<ResetPassword />);

    await fillPasswords("Secret@123", "Secret@123");
    await userEvent.click(submitButton());

    await waitFor(() =>
      expect(mockRouter.replace).toHaveBeenCalledWith("/auth/login"),
    );
    expect(calls[0].body).toEqual({
      passwordResetToken: "reset-1",
      password: "Secret@123",
    });
    expect(
      await screen.findByText("Password reset successful"),
    ).toBeInTheDocument();
    expect(store.getState().app.isForgotPassword).toBe(false);
    expect(store.getState().app.request).toBeUndefined();
  });

  // ! Shows the backend's message, e.g. when the new password matches the old one.
  it("shows the error when the reset is refused", async () => {
    mockApi({
      "POST /auth/reset-password": {
        status: 400,
        body: { message: "New password cannot be the same as the old one" },
      },
    });
    renderWithProviders(<ResetPassword />);

    await fillPasswords("Secret@123", "Secret@123");
    await userEvent.click(submitButton());

    expect(
      await screen.findByText("New password cannot be the same as the old one"),
    ).toBeInTheDocument();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});
