import React from "react";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "#test/utils/user";
import { RecentActivity } from "#components/elements/dashboard/RecentActivity";
import ActivityPage from "#/app/dashboard/activity/page";
import { mockRouter, useSearchParams } from "#test/mocks/navigation";
import { mockApi } from "#test/utils/api";
import { chooseOption } from "#test/utils/select";
import { renderWithProviders, resetStore } from "#test/utils/render";

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString();

const userLogs = (count: number, page = 1) => ({
  message: "User activity fetched successfully",
  logs: Array.from({ length: count }, (_, i) => ({
    logId: `user-log-${page}-${i}`,
    userId: "user-1",
    activity_type: "USRLGN",
    description: `Ada logged in (${page}.${i})`,
    activity_status: i === 1 ? "failed" : "success",
    createdAt: minutesAgo(5 + i),
    userDetails: { userId: "user-1", first_name: "Ada", last_name: "Lovelace" },
  })),
  pagination: { page, limit: count, total: 45, totalPages: 3 },
});

const adminLogs = {
  message: "Admin activity fetched successfully",
  logs: [
    {
      logId: "admin-log-1",
      adminId: "admin-1",
      activity_type: "ADMINVITE",
      description: "Patty invited Sam",
      activity_status: "success",
      createdAt: minutesAgo(90),
      adminDetails: {
        adminId: "admin-1",
        first_name: "Patty",
        last_name: "Ose",
        email: "patty@example.com",
      },
    },
    {
      logId: "admin-log-2",
      adminId: "gone",
      activity_type: "ADMLGR",
      description: "An old admin tried to log in",
      activity_status: "failed",
      createdAt: minutesAgo(60 * 24 * 3),
      adminDetails: null,
    },
  ],
  pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
};

describe("Recent activity on the dashboard", () => {
  beforeEach(() => {
    resetStore({ isLoggedIn: true });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Shows the ten latest user and admin events, each linking to the full log.
  it("lists the latest user and admin activity", async () => {
    const calls = mockApi({
      "GET /activity/users?page=1&limit=10": { body: userLogs(10) },
      "GET /activity/admins?page=1&limit=10": { body: adminLogs },
    });
    renderWithProviders(<RecentActivity />);

    const users = (await screen.findByRole("heading", {
      name: "Recent user activity",
    })).closest("section") as HTMLElement;
    const admins = screen
      .getByRole("heading", { name: "Recent admin activity" })
      .closest("section") as HTMLElement;

    expect(
      await within(users).findByText("Ada logged in (1.0)"),
    ).toBeInTheDocument();
    // header row + 10 events
    expect(within(users).getAllByRole("row")).toHaveLength(11);
    expect(within(users).getByText("5 minutes ago")).toBeInTheDocument();
    expect(within(users).getAllByText("Failed")).toHaveLength(1);

    expect(within(admins).getByText("Patty invited Sam")).toBeInTheDocument();
    expect(within(admins).getByText("Patty Ose")).toBeInTheDocument();
    expect(within(admins).getByText("Removed admin")).toBeInTheDocument();
    expect(within(admins).getByText("3 days ago")).toBeInTheDocument();

    expect(
      within(users).getByRole("link", { name: /view all user activity/i }),
    ).toHaveAttribute("href", "/dashboard/activity?tab=users");
    expect(
      within(admins).getByRole("link", { name: /view all admin activity/i }),
    ).toHaveAttribute("href", "/dashboard/activity?tab=admins");

    expect(calls.map((call) => call.path)).toEqual(
      expect.arrayContaining([
        "/activity/users?page=1&limit=10",
        "/activity/admins?page=1&limit=10",
      ]),
    );
  });

  // Each section reports its own failure.
  it("shows a retry when a log fails to load", async () => {
    mockApi({
      "GET /activity/users?page=1&limit=10": { body: userLogs(3) },
      "GET /activity/admins?page=1&limit=10": {
        status: 500,
        body: { message: "Server error" },
      },
    });
    renderWithProviders(<RecentActivity />);

    expect(
      await screen.findByText("We couldn't load recent admin activity"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Ada logged in (1.0)")).toBeInTheDocument();
  });
});

describe("Activity log page", () => {
  beforeEach(() => {
    resetStore({ isLoggedIn: true });
    jest.clearAllMocks();
    useSearchParams.mockReturnValue(new URLSearchParams());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Opens on user activity, 20 per page, and pages through the server.
  it("pages through user activity", async () => {
    const calls = mockApi({
      "GET /activity/users?page=1&limit=20": { body: userLogs(20) },
      "GET /activity/users?page=2&limit=20": { body: userLogs(20, 2) },
    });
    renderWithProviders(<ActivityPage />);

    expect(await screen.findByText("Ada logged in (1.0)")).toBeInTheDocument();
    expect(screen.getByText("45 events")).toBeInTheDocument();

    // simple pagination: previous / page box / next
    await userEvent.click(screen.getByTitle("Next Page"));

    expect(await screen.findByText("Ada logged in (2.0)")).toBeInTheDocument();
    expect(calls.map((call) => call.path)).toContain(
      "/activity/users?page=2&limit=20",
    );
  });

  // Filtering by status asks the server for that status from page one.
  it("filters by status", async () => {
    const calls = mockApi({
      "GET /activity/users?page=1&limit=20": { body: userLogs(20) },
      "GET /activity/users?page=1&limit=20&status=failed": {
        body: userLogs(2),
      },
    });
    renderWithProviders(<ActivityPage />);
    await screen.findByText("Ada logged in (1.0)");

    await chooseOption("Status", "Failed");

    await waitFor(() =>
      expect(calls.map((call) => call.path)).toContain(
        "/activity/users?page=1&limit=20&status=failed",
      ),
    );
  });

  // The admins tab comes from the URL, and switching tabs updates the URL.
  it("opens the admin tab from the URL and switches tabs", async () => {
    useSearchParams.mockReturnValue(new URLSearchParams("tab=admins"));
    mockApi({
      "GET /activity/admins?page=1&limit=20": { body: adminLogs },
      "GET /activity/users?page=1&limit=20": { body: userLogs(20) },
    });
    renderWithProviders(<ActivityPage />);

    expect(await screen.findByText("Patty invited Sam")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "User activity" }));

    expect(mockRouter.replace).toHaveBeenCalledWith("/?tab=users");
  });
});

describe("Recent activity rows", () => {
  beforeEach(() => {
    resetStore({ isLoggedIn: true });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Clicking any event opens the full log on the matching tab.
  it("opens the activity page when a row is clicked", async () => {
    mockApi({
      "GET /activity/users?page=1&limit=10": { body: userLogs(2) },
      "GET /activity/admins?page=1&limit=10": { body: adminLogs },
    });
    renderWithProviders(<RecentActivity />);

    await userEvent.click(await screen.findByText("Patty invited Sam"));

    expect(mockRouter.push).toHaveBeenCalledWith(
      "/dashboard/activity?tab=admins",
    );
  });
});

