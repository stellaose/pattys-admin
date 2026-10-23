import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "#test/utils/user";
import ForgotPassword from "#/app/auth/forgot-password/page";
import { mockRouter } from "#test/mocks/navigation";
import { mockApi } from "#test/utils/api";
import { renderWithProviders, resetStore, store } from "#test/utils/render";

const submitButton = () => screen.getByRole("button", { name: /send code/i });
const emailInput = () => screen.getByPlaceholderText("admin@pattys.com");

describe("Forgot password page", () => {
  beforeEach(() => {
    resetStore();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ' Enables the send-code action after an e-mail address has been entered.
  it("keeps the submit button disabled until an e-mail is entered", async () => {
    renderWithProviders(<ForgotPassword />);

    expect(submitButton()).toBeDisabled();

    await userEvent.type(emailInput(), "ada@example.com");

    await waitFor(() => expect(submitButton()).toBeEnabled());
  });

  // > Shows a validation error and makes no request for a malformed e-mail.
  it("rejects an invalid e-mail", async () => {
    const calls = mockApi({});
    renderWithProviders(<ForgotPassword />);

    await userEvent.type(emailInput(), "not-an-email");
    await waitFor(() => expect(submitButton()).toBeEnabled());
    await userEvent.click(submitButton());

    expect(await screen.findByText(/valid e-mail/i)).toBeInTheDocument();
    expect(calls).toHaveLength(0);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  // < Requests a reset code, marks the flow as recovery, and opens OTP verification.
  it("sends the code and moves on to verification in forgot-password mode", async () => {
    const calls = mockApi({
      "POST /auth/forgot-password": {
        body: {
          message: "A reset code has been sent to your e-mail",
          admin: { adminId: "admin-1", email: "ada@example.com" },
        },
      },
    });
    renderWithProviders(<ForgotPassword />);

    await userEvent.type(emailInput(), "ada@example.com");
    await waitFor(() => expect(submitButton()).toBeEnabled());
    await userEvent.click(submitButton());

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith("/auth/verify-otp"),
    );
    expect(calls[0].body).toEqual({ email: "ada@example.com" });
    expect(store.getState().app.isForgotPassword).toBe(true);
    expect(store.getState().app.adminId).toBe("admin-1");
    expect(store.getState().app.request).toEqual({ email: "ada@example.com" });
  });

  // ! Shows the backend's message when the e-mail is unknown.
  it("shows the error for an unknown admin", async () => {
    mockApi({
      "POST /auth/forgot-password": {
        status: 404,
        body: { message: "Admin not found" },
      },
    });
    renderWithProviders(<ForgotPassword />);

    await userEvent.type(emailInput(), "nobody@example.com");
    await waitFor(() => expect(submitButton()).toBeEnabled());
    await userEvent.click(submitButton());

    expect(await screen.findByText("Admin not found")).toBeInTheDocument();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  // ? Returns to the login page from password recovery.
  it("goes back to login", async () => {
    renderWithProviders(<ForgotPassword />);

    await userEvent.click(screen.getByText(/back to login/i));

    expect(mockRouter.push).toHaveBeenCalledWith("/auth/login");
  });
});
