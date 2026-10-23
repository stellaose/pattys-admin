import React from "react";
import { screen, waitFor, within } from "@testing-library/react";
import { BreakdownCharts } from "#components/elements/dashboard/BreakdownCharts";
import { NumbersStrip } from "#components/elements/dashboard/NumbersStrip";
import { mockApi } from "#test/utils/api";
import { renderWithProviders, resetStore } from "#test/utils/render";
import { chooseOption } from "#test/utils/select";

const slices = (pairs: [string, number][]) =>
  pairs.map(([label, value]) => ({ label, value }));

const breakdown = (period: string, users = 10) => ({
  message: "Dashboard breakdown fetched successfully",
  period,
  range: null,
  users: {
    total: users,
    byGender: slices([
      ["male", 4],
      ["female", users - 4],
    ]),
    byVerification: slices([
      ["verified", users],
      ["unverified", 0],
    ]),
  },
  admins: {
    total: 3,
    byStatus: slices([
      ["pending", 1],
      ["active", 2],
      ["inactive", 0],
    ]),
    byRole: slices([
      ["super_admin", 1],
      ["content_manager", 2],
    ]),
  },
  blogs: {
    total: 0,
    byCategory: [],
    byStatus: slices([
      ["published", 0],
      ["flagged", 0],
    ]),
  },
});

const totals = {
  message: "Dashboard totals fetched successfully",
  totals: {
    users: 48211,
    admins: 7,
    blogs: 9734,
    reviews: 612,
    contactMessages: 0,
    visits: 1284330,
  },
};

const legend = (name: string) => screen.getByRole("list", { name });

describe("Dashboard breakdown charts", () => {
  beforeEach(() => {
    resetStore({ isLoggedIn: true });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Shows every group with its count and share, including empty ones.
  it("lists each group with its count and share", async () => {
    mockApi({ "GET /dashboard/breakdown?": { body: breakdown("all") } });
    renderWithProviders(<BreakdownCharts />);

    const gender = await screen.findByRole("list", { name: "Users by gender" });
    expect(within(gender).getByText("Male")).toBeInTheDocument();
    expect(within(gender).getByText("40%")).toBeInTheDocument();
    expect(
      within(legend("Email verification")).getByText("0%"),
    ).toBeInTheDocument();

    // ? role labels are made readable
    expect(
      within(legend("Admins by role")).getByText("Content manager"),
    ).toBeInTheDocument();
    expect(
      within(legend("Admins by status")).getByText("Active"),
    ).toBeInTheDocument();
  });

  // Says so plainly instead of drawing an empty pie.
  it("explains when a chart has nothing to show", async () => {
    mockApi({ "GET /dashboard/breakdown?": { body: breakdown("all") } });
    renderWithProviders(<BreakdownCharts />);

    expect(
      await screen.findByText("No blogs in this period."),
    ).toBeInTheDocument();
  });

  // Asks the backend for the chosen period; "All time" sends none.
  it("reloads for a different period", async () => {
    const calls = mockApi({
      "GET /dashboard/breakdown?": { body: breakdown("all") },
      "GET /dashboard/breakdown?period=week": { body: breakdown("week", 5) },
    });
    renderWithProviders(<BreakdownCharts />);
    await screen.findByRole("list", { name: "Users by gender" });

    await chooseOption("Breakdown period", "Week");

    expect(
      await screen.findByText("Joined or created this week"),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(calls.map((call) => call.path)).toContain(
        "/dashboard/breakdown?period=week",
      ),
    );
    // ? 1 of this week's 5 users is female; the chart is replaced while it reloads
    expect(await screen.findByText("20%")).toBeInTheDocument();
  });
});

describe("Dashboard numbers strip", () => {
  beforeEach(() => {
    resetStore({ isLoggedIn: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Shows the all-time totals, shortened when large, with the exact value on hover.
  it("shows the all-time totals", async () => {
    const calls = mockApi({ "GET /dashboard/totals": { body: totals } });
    renderWithProviders(<NumbersStrip />);

    const strip = await screen.findByLabelText("All-time numbers");
    expect(await within(strip).findByText("48.2K")).toHaveAttribute(
      "title",
      "48,211",
    );
    expect(within(strip).getByText("Admins").nextSibling).toHaveTextContent(
      "7",
    );
    expect(within(strip).getByText("1.3M")).toBeInTheDocument();
    // ? totals are all-time, so no period is sent
    expect(calls.map((call) => call.path)).toEqual(["/dashboard/totals"]);
  });
});
