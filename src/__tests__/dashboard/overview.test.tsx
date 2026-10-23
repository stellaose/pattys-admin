import React from "react";
import { screen, waitFor, within } from "@testing-library/react";
import { Overview } from "#components/elements";
import { mockApi } from "#test/utils/api";
import { chooseOption } from "#test/utils/select";
import { renderWithProviders, resetStore } from "#test/utils/render";

// Card totals and breakdown charts are covered in cards.test.tsx and
// breakdown.test.tsx; this file covers the users/logins/category charts and
// the most liked lists.

const point = (day: number, values: Record<string, number>) => ({
  periodStart: `2026-10-${day}T00:00:00.000Z`,
  visits: 0,
  failedLogins: 0,
  signups: 0,
  deletedUsers: 0,
  admins: 0,
  blogs: 0,
  flaggedBlogs: 0,
  reviews: 0,
  contactMessages: 0,
  ...values,
});

const trends = (interval: string) => ({
  message: "Dashboard trends fetched successfully",
  interval,
  count: 2,
  range: { from: "2026-10-21T00:00:00.000Z", to: "2026-10-22T23:59:59.999Z" },
  series: [
    point(21, { signups: 41, deletedUsers: 3, visits: 310, failedLogins: 12 }),
    point(22, { signups: 57, deletedUsers: 6, visits: 284, failedLogins: 9 }),
  ],
});

const slices = (pairs: [string, number][]) =>
  pairs.map(([label, value]) => ({ label, value }));

const breakdown = {
  message: "Dashboard breakdown fetched successfully",
  period: "all",
  range: null,
  users: {
    total: 10,
    byGender: slices([["male", 4], ["female", 6]]),
    byVerification: slices([["verified", 8], ["unverified", 2]]),
  },
  admins: {
    total: 2,
    byStatus: slices([["active", 2]]),
    byRole: slices([["Super Admin", 2]]),
  },
  blogs: {
    total: 210,
    byCategory: slices([
      ["news", 80],
      ["politics", 40],
      ["entertainment", 30],
      ["sports", 25],
      ["business", 15],
      ["education", 12],
      ["other", 8],
    ]),
    byStatus: slices([["published", 205], ["flagged", 5]]),
  },
};

const author = {
  userId: "user-1",
  first_name: "Ada",
  last_name: "Lovelace",
  user_name: "ada",
};

const topBlogs = {
  message: "Most liked blogs fetched successfully",
  blogs: [
    {
      blogId: "blog-1",
      title: "How Lagos learned to love the bus",
      category: "news",
      likeNo: 1204,
      reviewCount: 18,
      isFlagged: false,
      createdAt: "2026-10-01T00:00:00.000Z",
      author: "user-1",
      authorDetails: author,
    },
    {
      blogId: "blog-2",
      title: "A flagged post",
      category: "politics",
      likeNo: 3,
      reviewCount: 0,
      isFlagged: true,
      createdAt: "2026-10-02T00:00:00.000Z",
      author: "user-9",
      authorDetails: null,
    },
  ],
};

const topReviews = {
  message: "Most liked reviews fetched successfully",
  reviews: [
    {
      reviewId: "review-1",
      blogId: "blog-1",
      blogTitle: "How Lagos learned to love the bus",
      review: "Best thing I have read all year",
      likeNo: 77,
      createdAt: "2026-10-03T00:00:00.000Z",
      author: "user-1",
      authorDetails: author,
    },
  ],
};

const routes = {
  "GET /dashboard/totals": {
    body: {
      totals: {
        users: 1,
        admins: 1,
        blogs: 1,
        reviews: 1,
        contactMessages: 1,
        visits: 1,
      },
    },
  },
  "GET /dashboard/trends?interval=week": { body: trends("week") },
  "GET /dashboard/trends?interval=month": { body: trends("month") },
  // empty params still add a trailing "?" to the URL
  "GET /dashboard/breakdown?": { body: breakdown },
  "GET /dashboard/top-blogs?limit=10": { body: topBlogs },
  "GET /dashboard/top-reviews?limit=10": { body: topReviews },
};

const section = (name: string) =>
  screen.getByRole("heading", { name }).closest("section") as HTMLElement;

describe("Dashboard overview charts", () => {
  beforeEach(() => {
    resetStore({ isLoggedIn: true });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // The line chart plots accounts created against accounts deleted.
  it("charts users created and deleted", async () => {
    mockApi(routes);
    renderWithProviders(<Overview />);

    const users = await waitFor(() => section("Users"));
    const table = await within(users).findByRole("table");

    expect(within(table).getByText("Users created")).toBeInTheDocument();
    expect(within(table).getByText("Users deleted")).toBeInTheDocument();
    expect(within(table).getByText("57")).toBeInTheDocument();
    expect(within(table).getByText("6")).toBeInTheDocument();
    // legend totals for the period, so lines are labelled without colour
    expect(within(users).getByText("98")).toBeInTheDocument();
    expect(within(users).getByText("9")).toBeInTheDocument();
  });

  // The bar chart plots logins and has its own period filter.
  it("charts logins and reloads them for a new period", async () => {
    const calls = mockApi(routes);
    renderWithProviders(<Overview />);

    const logins = await waitFor(() => section("Logins"));
    const table = await within(logins).findByRole("table");
    expect(within(table).getByText("Successful logins")).toBeInTheDocument();
    expect(within(table).getByText("310")).toBeInTheDocument();
    expect(within(logins).getByText("594")).toBeInTheDocument();

    await chooseOption("Login chart period", "Month", logins);

    await waitFor(() =>
      expect(calls.map((call) => call.path)).toContain(
        "/dashboard/trends?interval=month",
      ),
    );
    expect(
      await within(section("Logins")).findByText("Last 12 months"),
    ).toBeInTheDocument();
    // the users chart keeps its own period
    expect(within(section("Users")).getByText("Last 12 weeks")).toBeInTheDocument();
  });

  // The pie shows the five largest categories and folds the rest into Other.
  it("shows blogs by category with the tail folded into Other", async () => {
    mockApi(routes);
    renderWithProviders(<Overview />);

    const legend = await screen.findByRole("list", {
      name: "Blogs by category",
    });
    const rows = within(legend).getAllByRole("listitem");

    expect(rows.map((row) => row.textContent)).toEqual([
      "News8038%",
      "Politics4019%",
      "Entertainment3014%",
      "Sports2512%",
      "Business157%",
      "Other2010%",
    ]);
  });

  // Each most liked blog and review links to the blog's details page.
  it("lists the most liked blogs and reviews as links", async () => {
    mockApi(routes);
    renderWithProviders(<Overview />);

    await screen.findByText("Best thing I have read all year", { exact: false });
    const linkTo = (href: string) =>
      screen
        .getAllByRole("link")
        .find((link) => link.getAttribute("href") === href) as HTMLElement;

    const blogLink = linkTo("/dashboard/blogs/blog-1");
    expect(blogLink).toHaveTextContent("How Lagos learned to love the bus");
    expect(within(blogLink).getByText("Ada Lovelace")).toBeInTheDocument();
    expect(within(blogLink).getByText("1,204")).toBeInTheDocument();

    const flagged = linkTo("/dashboard/blogs/blog-2");
    expect(within(flagged).getByText("Flagged")).toBeInTheDocument();
    expect(within(flagged).getByText("Deleted user")).toBeInTheDocument();

    const reviewLink = linkTo("/dashboard/blogs/blog-1#review-review-1");
    expect(reviewLink).toHaveTextContent("Best thing I have read all year");
    expect(reviewLink).toHaveTextContent("Ada Lovelace on");

    expect(
      screen.getByRole("link", { name: /view all blogs/i }),
    ).toHaveAttribute("href", "/dashboard/blogs");
    expect(
      screen.getByRole("link", { name: /view all comments/i }),
    ).toHaveAttribute("href", "/dashboard/comments");
  });

  // A failing chart shows a retry inside its own card only.
  it("shows a retry inside a chart card when its data fails", async () => {
    mockApi({
      ...routes,
      "GET /dashboard/top-blogs?limit=10": {
        status: 500,
        body: { message: "Server error" },
      },
    });
    renderWithProviders(<Overview />);

    const topBlogsCard = await waitFor(() => section("Most liked blogs"));
    expect(
      await within(topBlogsCard).findByText(
        "We couldn't load the most liked blogs",
      ),
    ).toBeInTheDocument();
    expect(
      within(section("Most liked comments")).getByRole("link", {
        name: /best thing/i,
      }),
    ).toBeInTheDocument();
  });
});
