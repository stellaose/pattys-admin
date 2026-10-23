import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "#test/utils/user";
import CompleteProfile from "#/app/auth/complete-profile/page";
import { mockRouter } from "#test/mocks/navigation";
import { mockApi } from "#test/utils/api";
import { renderWithProviders, resetStore, store } from "#test/utils/render";

const submitButton = () =>
  screen.getByRole("button", { name: /finish setup/i });

const chooseGender = async (label: "Female" | "Male") => {
  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.click(await screen.findByTitle(label));
};

const fillProfile = async (phone = "08012345678") => {
  await userEvent.type(screen.getByPlaceholderText("Enter first name"), " Ada ");
  await userEvent.type(screen.getByPlaceholderText("Enter last name"), "Lovelace");
  await chooseGender("Female");
  await userEvent.type(screen.getByPlaceholderText("Phone Number"), phone);
  await waitFor(() => expect(submitButton()).toBeEnabled());
};

const completedAdmin = {
  adminId: "admin-1",
  first_name: "Ada",
  last_name: "Lovelace",
  email: "ada@example.com",
  phone_number: "08012345678",
  gender: "female",
  is_created_password: true,
  is_completed_profile: true,
  permissions: [],
};

describe("Complete profile page", () => {
  beforeEach(() => {
    resetStore({
      user: { email: "ada@example.com", is_completed_profile: false },
      request: { email: "ada@example.com" },
    });
    sessionStorage.setItem(`${process.env.NEXT_PUBLIC_TOKEN}`, "jwt-1");
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Shows the account e-mail and keeps submission off until every required field is filled.
  it("shows the account e-mail and starts disabled", () => {
    renderWithProviders(<CompleteProfile />);

    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  // Previews the admin's initials as they type their name.
  it("previews initials from the name", async () => {
    renderWithProviders(<CompleteProfile />);

    await userEvent.type(screen.getByPlaceholderText("Enter first name"), "Ada");
    await userEvent.type(screen.getByPlaceholderText("Enter last name"), "Lovelace");

    expect(await screen.findByText("AL")).toBeInTheDocument();
  });

  // Rejects a phone number that is not a full Nigerian mobile number.
  it("rejects an invalid phone number", async () => {
    const calls = mockApi({});
    renderWithProviders(<CompleteProfile />);

    await fillProfile("0801");
    await userEvent.click(submitButton());

    expect(
      await screen.findByText("Phone number must start with 07 or 08 or 09"),
    ).toBeInTheDocument();
    expect(calls).toHaveLength(0);
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  // Saves the profile, logs the admin in with the returned record and opens the dashboard.
  it("saves the profile and opens the dashboard", async () => {
    const calls = mockApi({
      "PATCH /admins/me/complete-profile": {
        body: {
          message: "Profile completed successfully",
          admin: completedAdmin,
        },
      },
    });
    renderWithProviders(<CompleteProfile />);

    await fillProfile();
    await userEvent.click(submitButton());

    await waitFor(() =>
      expect(mockRouter.replace).toHaveBeenCalledWith("/dashboard"),
    );
    expect(calls[0].body).toEqual({
      first_name: "Ada",
      last_name: "Lovelace",
      phone_number: "08012345678",
      gender: "female",
    });
    expect(calls[0].headers.get("Authorization")).toBe("Bearer jwt-1");
    expect(
      await screen.findByText("Profile completed successfully"),
    ).toBeInTheDocument();
    expect(store.getState().app.isLoggedIn).toBe(true);
    expect(store.getState().app.user).toEqual(completedAdmin);
    expect(store.getState().app.request).toBeUndefined();
  });

  // Shows the backend's message and stays on the page when saving fails.
  it("shows the error when the profile is refused", async () => {
    mockApi({
      "PATCH /admins/me/complete-profile": {
        status: 400,
        body: { message: "Profile already completed" },
      },
    });
    renderWithProviders(<CompleteProfile />);

    await fillProfile();
    await userEvent.click(submitButton());

    expect(
      await screen.findByText("Profile already completed"),
    ).toBeInTheDocument();
    expect(store.getState().app.isLoggedIn).toBe(false);
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  // Offers a way back to login.
  it("links back to login", async () => {
    renderWithProviders(<CompleteProfile />);

    await userEvent.click(screen.getByText(/back to login/i));

    expect(mockRouter.push).toHaveBeenCalledWith("/auth/login");
  });
});
