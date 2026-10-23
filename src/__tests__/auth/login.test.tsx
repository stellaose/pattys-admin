import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "#test/utils/user";
import Login from "#/app/auth/login/page";
import { mockRouter } from "#test/mocks/navigation";
import { mockApi } from "#test/utils/api";
import { renderWithProviders, resetStore, store } from "#test/utils/render";

const submitButton = () => screen.getByRole("button", { name: /log in/i });

const fillForm = async (email = "ada@example.com", password = "Secret@123") => {
  await userEvent.type(screen.getByPlaceholderText("Enter email address"), email);
  await userEvent.type(
    screen.getByPlaceholderText("Enter your password"),
    password,
  );
  await waitFor(() => expect(submitButton()).toBeEnabled());
};

describe("Login page", () => {
  beforeEach(() => {
    resetStore();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // @ Enables submission only after both the e-mail and password have been entered.
  it("keeps the submit button disabled until both fields are filled", async () => {
    renderWithProviders(<Login />);

    expect(submitButton()).toBeDisabled();

    await userEvent.type(
      screen.getByPlaceholderText("Enter email address"),
      "ada@example.com",
    );
    expect(submitButton()).toBeDisabled();

    await userEvent.type(
      screen.getByPlaceholderText("Enter your password"),
      "Secret@123",
    );

    await waitFor(() => expect(submitButton()).toBeEnabled());
  });

  // # Sends the credentials and moves on to the login code.
  it("requests a login code and opens verification", async () => {
    const calls = mockApi({
      "POST /auth/login": {
        body: {
          message: "A login code has been sent to your e-mail",
          admin: { adminId: "admin-1", email: "ada@example.com" },
        },
      },
    });
    renderWithProviders(<Login />);

    await fillForm();
    await userEvent.click(submitButton());

    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith("/auth/verify-otp"),
    );
    expect(calls[0].body).toEqual({
      email: "ada@example.com",
      password: "Secret@123",
    });
    expect(
      await screen.findByText("A login code has been sent to your e-mail"),
    ).toBeInTheDocument();
    expect(store.getState().app.adminId).toBe("admin-1");
    expect(store.getState().app.isForgotPassword).toBe(false);
    expect(store.getState().app.request?.email).toBe("ada@example.com");
  });

  // ! Shows the backend's message and stays on the page when the login fails.
  it("shows the error for wrong credentials", async () => {
    mockApi({
      "POST /auth/login": {
        status: 400,
        body: { message: "Invalid credentials" },
      },
    });
    renderWithProviders(<Login />);

    await fillForm();
    await userEvent.click(submitButton());

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  // ? Navigates to the password recovery flow from the forgot-password link.
  it("links to the forgot password page", async () => {
    renderWithProviders(<Login />);

    await userEvent.click(screen.getByText(/forgot your password/i));

    expect(mockRouter.push).toHaveBeenCalledWith("/auth/forgot-password");
  });
});
