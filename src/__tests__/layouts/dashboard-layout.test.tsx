import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "#test/utils/user";
import { DashboardLayout } from "#components/layouts";
import { mockRouter, usePathname } from "#test/mocks/navigation";
import { mockApi } from "#test/utils/api";
import { renderWithProviders, resetStore, store } from "#test/utils/render";

const admin = {
  first_name: "Ada",
  last_name: "Lovelace",
  email: "ada@example.com",
};

const renderLayout = () =>
  renderWithProviders(
    <DashboardLayout>
      <p>Page content</p>
    </DashboardLayout>,
  );

describe("DashboardLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usePathname.mockReturnValue("/dashboard");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("when logged out", () => {
    beforeEach(() => resetStore());

    // Redirects unauthenticated visitors and keeps protected dashboard content hidden.
    it("sends the visitor to login and hides the dashboard", async () => {
      renderLayout();

      await waitFor(() =>
        expect(mockRouter.replace).toHaveBeenCalledWith("/auth/login"),
      );
      expect(screen.queryByText("Page content")).not.toBeInTheDocument();
    });
  });

  describe("when logged in", () => {
    beforeEach(() => resetStore({ isLoggedIn: true, user: admin }));

    // Shows the page content, admin identity, and dashboard navigation without redirecting.
    it("renders the page inside the sidebar and header", () => {
      renderLayout();

      expect(screen.getByText("Page content")).toBeInTheDocument();
      expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
      for (const label of [
        "Overview",
        "Blogs",
        "Bloggers",
        "Comments",
        "Contact",
        "Administrators",
        "Roles",
        "Activity",
        "Profile",
      ]) {
        expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
      }
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    // Derives the header title from the current dashboard route.
    it("titles the header after the current section", () => {
      usePathname.mockReturnValue("/dashboard/blogs/42");
      renderLayout();

      expect(
        screen.getByRole("heading", { level: 1, name: "Blogs" }),
      ).toBeInTheDocument();
    });

    // Uses a caller-provided title instead of deriving one from the route.
    it("prefers an explicit title", () => {
      renderWithProviders(
        <DashboardLayout title="Edit blog">
          <p>Page content</p>
        </DashboardLayout>,
      );

      expect(
        screen.getByRole("heading", { level: 1, name: "Edit blog" }),
      ).toBeInTheDocument();
    });

    // Displays the admin's e-mail when no first or last name is available.
    it("falls back to the e-mail when the admin has no name", () => {
      resetStore({ isLoggedIn: true, user: { email: "ada@example.com" } });
      renderLayout();

      expect(screen.getByText("ada@example.com")).toBeInTheDocument();
    });

    // Clears the logged-in user and sends the admin to login when logging out.
    it("logs out from the sidebar", async () => {
      const calls = mockApi({
        "POST /auth/logout": { body: { message: "Logout successful" } },
      });
      renderLayout();

      await userEvent.click(screen.getByRole("button", { name: /log out/i }));

      await waitFor(() =>
        expect(store.getState().app.isLoggedIn).toBe(false),
      );
      expect(calls[0]).toMatchObject({ method: "POST", path: "/auth/logout" });
      expect(store.getState().app.user).toBeUndefined();
      expect(mockRouter.replace).toHaveBeenCalledWith("/auth/login");
    });

    // Ends the session locally even when the logout request fails.
    it("still logs out when the server call fails", async () => {
      mockApi({
        "POST /auth/logout": { status: 500, body: { message: "Server error" } },
      });
      renderLayout();

      await userEvent.click(screen.getByRole("button", { name: /log out/i }));

      await waitFor(() =>
        expect(mockRouter.replace).toHaveBeenCalledWith("/auth/login"),
      );
      expect(store.getState().app.isLoggedIn).toBe(false);
    });
  });

  describe("collapsible sidebar", () => {
    beforeEach(() => {
      resetStore({ isLoggedIn: true, user: admin });
      localStorage.removeItem("pattys-admin:sidebar-collapsed");
    });

    // Collapses to the icon rail, remembers it, and expands again.
    it("collapses and expands from the sidebar edge button", async () => {
      renderLayout();

      const toggle = screen.getByRole("button", { name: "Collapse sidebar" });
      expect(toggle).toHaveAttribute("aria-expanded", "true");

      await userEvent.click(toggle);

      const expand = screen.getByRole("button", { name: "Expand sidebar" });
      expect(expand).toHaveAttribute("aria-expanded", "false");
      expect(localStorage.getItem("pattys-admin:sidebar-collapsed")).toBe(
        "true",
      );
      // the links keep an accessible name once their labels are hidden
      expect(screen.getByRole("link", { name: "Blogs" })).toBeInTheDocument();

      await userEvent.click(expand);

      expect(
        screen.getByRole("button", { name: "Collapse sidebar" }),
      ).toHaveAttribute("aria-expanded", "true");
      expect(localStorage.getItem("pattys-admin:sidebar-collapsed")).toBe(
        "false",
      );
    });

    // Opens collapsed when the admin collapsed it on a previous visit.
    it("remembers the collapsed state", () => {
      localStorage.setItem("pattys-admin:sidebar-collapsed", "true");
      renderLayout();

      expect(
        screen.getByRole("button", { name: "Expand sidebar" }),
      ).toHaveAttribute("aria-expanded", "false");
    });
  });
});
