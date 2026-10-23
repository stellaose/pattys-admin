import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "#test/utils/user";
import SetPassword from "#/app/auth/set-password/page";
import { mockRouter } from "#test/mocks/navigation";
import { mockApi } from "#test/utils/api";
import { renderWithProviders, resetStore, store } from "#test/utils/render";

const submitButton = () => screen.getByRole("button", { name: /continue/i });

const fillPasswords = async (password: string, confirm: string) => {
  await userEvent.type(
    screen.getByPlaceholderText("Create a password"),
    password,
  );
  await userEvent.type(
    screen.getByPlaceholderText("Re-enter the password"),
    confirm,
  );
  await waitFor(() => expect(submitButton()).toBeEnabled());
};

describe("Set password page", () => {
  beforeEach(() => {
    // > verify-login has already stored the token and the not-yet-set-up admin
    resetStore({
      user: {
        email: "ada@example.com",
        is_created_password: false,
        is_completed_profile: false,
      },
      request: { email: "ada@example.com" },
    });
    sessionStorage.setItem(`${process.env.NEXT_PUBLIC_TOKEN}`, "jwt-1");
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Keeps submission unavailable until both password fields have values.
  it("keeps the submit button disabled until both fields are filled", () => {
    renderWithProviders(<SetPassword />);

    expect(submitButton()).toBeDisabled();
  });

  // Rejects a password that does not meet the strength requirements.
  it("rejects a weak password", async () => {
    renderWithProviders(<SetPassword />);

    await fillPasswords("password", "password");
    await userEvent.click(submitButton());

    expect(
      await screen.findByText(/must contain at least 8 characters/i),
    ).toBeInTheDocument();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  // Rejects confirmation when it differs from the password.
  it("rejects passwords that do not match", async () => {
    renderWithProviders(<SetPassword />);

    await fillPasswords("Secret@123", "Secret@999");
    await userEvent.click(submitButton());

    expect(
      await screen.findByText("Passwords do not match"),
    ).toBeInTheDocument();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  // Replaces the temporary password using the login token, then opens the profile step.
  it("creates the password and moves on to complete profile", async () => {
    const calls = mockApi({
      "POST /auth/create-password": {
        body: {
          message: "Password created successfully",
          admin: { adminId: "admin-1", is_created_password: true },
        },
      },
    });
    renderWithProviders(<SetPassword />);

    await fillPasswords("Secret@123", "Secret@123");
    await userEvent.click(submitButton());

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith("/auth/complete-profile"),
    );
    expect(calls[0].body).toEqual({ password: "Secret@123" });
    expect(calls[0].headers.get("Authorization")).toBe("Bearer jwt-1");
    expect(store.getState().app.user).toMatchObject({
      email: "ada@example.com",
      is_created_password: true,
      is_completed_profile: false,
    });
    expect(store.getState().app.isLoggedIn).toBe(false);
  });

  // Goes straight to the dashboard when the profile already exists.
  it("opens the dashboard when the profile is already complete", async () => {
    resetStore({
      user: { email: "ada@example.com", is_completed_profile: true },
      request: { email: "ada@example.com" },
    });
    mockApi({
      "POST /auth/create-password": {
        body: {
          message: "Password created successfully",
          admin: { adminId: "admin-1", is_created_password: true },
        },
      },
    });
    renderWithProviders(<SetPassword />);

    await fillPasswords("Secret@123", "Secret@123");
    await userEvent.click(submitButton());

    await waitFor(() =>
      expect(mockRouter.replace).toHaveBeenCalledWith("/dashboard"),
    );
    expect(store.getState().app.isLoggedIn).toBe(true);
  });

  // Shows the backend's message when the temporary password is reused.
  it("shows the error when the password is refused", async () => {
    mockApi({
      "POST /auth/create-password": {
        status: 400,
        body: { message: "New password cannot be the same as the old one" },
      },
    });
    renderWithProviders(<SetPassword />);

    await fillPasswords("Secret@123", "Secret@123");
    await userEvent.click(submitButton());

    expect(
      await screen.findByText("New password cannot be the same as the old one"),
    ).toBeInTheDocument();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
