import React from "react";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "#test/utils/user";
import BlogsPage from "#/app/dashboard/blogs/page";
import BloggersPage from "#/app/dashboard/bloggers/page";
import CommentsPage from "#/app/dashboard/comments/page";
import ContactPage from "#/app/dashboard/contact/page";
import AdministratorsPage from "#/app/dashboard/administrators/page";
import RolesPage from "#/app/dashboard/roles/page";
import ProfilePage from "#/app/dashboard/profile/page";
import { mockRouter } from "#test/mocks/navigation";
import { mockApi } from "#test/utils/api";
import { chooseOption } from "#test/utils/select";
import { renderWithProviders, resetStore } from "#test/utils/render";

const page = (key: string, rows: object[], total = rows.length) => ({
  [key]: rows,
  pagination: { count: rows.length, total, resultPerPage: 10 },
});

const ada = { userId: "user-1", first_name: "Ada", last_name: "Lovelace" };

const blog = {
  blogId: "blog-1",
  title: "How Lagos learned to love the bus",
  category: "news",
  likeNo: 1204,
  reviewCount: 18,
  isFlagged: false,
  createdAt: "2026-10-01T00:00:00.000Z",
  author: "user-1",
  authorDetails: ada,
};

const paths = (calls: { path: string }[]) => calls.map((call) => call.path);

beforeEach(() => {
  resetStore({ isLoggedIn: true });
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Blogs page", () => {
  const base = "/blogs?sort=-createdAt&page=1&limit=10";

  // Lists blogs with author, category, likes, comments and status.
  it("lists blogs", async () => {
    mockApi({ [`GET ${base}`]: { body: page("blogs", [blog], 23) } });
    renderWithProviders(<BlogsPage />);

    expect(
      await screen.findByText("How Lagos learned to love the bus"),
    ).toBeInTheDocument();
    const row = screen.getByText("How Lagos learned to love the bus").closest("tr")!;
    expect(within(row).getByText("Ada Lovelace")).toBeInTheDocument();
    expect(within(row).getByText("news")).toBeInTheDocument();
    expect(within(row).getByText("1,204")).toBeInTheDocument();
    expect(within(row).getByText("18")).toBeInTheDocument();
    expect(within(row).getByText("published")).toBeInTheDocument();
    expect(screen.getByText("23 total")).toBeInTheDocument();
  });

  // Search waits for typing to pause, then asks the server from page one.
  it("searches by title", async () => {
    const calls = mockApi({
      [`GET ${base}`]: { body: page("blogs", [blog]) },
      "GET /blogs?sort=-createdAt&keyword=lagos&page=1&limit=10": {
        body: page("blogs", [blog]),
      },
    });
    renderWithProviders(<BlogsPage />);
    await screen.findByText("How Lagos learned to love the bus");

    await userEvent.type(
      screen.getByRole("textbox", { name: "Search blog titles" }),
      "lagos",
    );

    await waitFor(() =>
      expect(paths(calls)).toContain(
        "/blogs?sort=-createdAt&keyword=lagos&page=1&limit=10",
      ),
    );
    // only one request for the whole word, not one per keystroke
    expect(paths(calls).filter((path) => path.includes("keyword"))).toHaveLength(1);
  });

  // The selects filter by category and status and change the order.
  it("filters and sorts with the selects", async () => {
    const calls = mockApi({
      [`GET ${base}`]: { body: page("blogs", [blog]) },
      "GET /blogs?category=politics&sort=-createdAt&page=1&limit=10": {
        body: page("blogs", []),
      },
      "GET /blogs?category=politics&isFlagged=true&sort=-createdAt&page=1&limit=10":
        { body: page("blogs", []) },
      "GET /blogs?category=politics&isFlagged=true&sort=-likeNo&page=1&limit=10":
        { body: page("blogs", []) },
    });
    renderWithProviders(<BlogsPage />);
    await screen.findByText("How Lagos learned to love the bus");

    await chooseOption("Category", "Politics");
    await chooseOption("Status", "Flagged");
    await chooseOption("Sort", "Most liked");

    await waitFor(() =>
      expect(paths(calls)).toContain(
        "/blogs?category=politics&isFlagged=true&sort=-likeNo&page=1&limit=10",
      ),
    );
    expect(
      await screen.findByText("No blogs match these filters."),
    ).toBeInTheDocument();
  });

  // Simple pagination asks the server for the next page.
  it("pages through results", async () => {
    const calls = mockApi({
      [`GET ${base}`]: { body: page("blogs", [blog], 23) },
      "GET /blogs?sort=-createdAt&page=2&limit=10": {
        body: page("blogs", [{ ...blog, blogId: "blog-2", title: "Page two" }], 23),
      },
    });
    renderWithProviders(<BlogsPage />);
    await screen.findByText("How Lagos learned to love the bus");

    await userEvent.click(screen.getByTitle("Next Page"));

    expect(await screen.findByText("Page two")).toBeInTheDocument();
    expect(paths(calls)).toContain("/blogs?sort=-createdAt&page=2&limit=10");
  });

  // Clicking a blog opens its details.
  it("opens a blog's details", async () => {
    mockApi({ [`GET ${base}`]: { body: page("blogs", [blog]) } });
    renderWithProviders(<BlogsPage />);

    await userEvent.click(
      await screen.findByText("How Lagos learned to love the bus"),
    );

    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard/blogs/blog-1");
  });
});

describe("Bloggers page", () => {
  // Shows each blogger's name, handle, e-mail, blog count and e-mail status.
  it("lists bloggers and filters by e-mail status", async () => {
    const calls = mockApi({
      "GET /bloggers?page=1&limit=10": {
        body: page("bloggers", [
          {
            ...ada,
            user_name: "ada",
            email: "ada@example.com",
            isEmailVerified: true,
            blogCount: 4,
            createdAt: "2026-01-05T00:00:00.000Z",
          },
        ]),
      },
      "GET /bloggers?isEmailVerified=false&page=1&limit=10": {
        body: page("bloggers", []),
      },
    });
    renderWithProviders(<BloggersPage />);

    const row = (await screen.findByText("Ada Lovelace")).closest("tr")!;
    expect(within(row).getByText("@ada")).toBeInTheDocument();
    expect(within(row).getByText("ada@example.com")).toBeInTheDocument();
    expect(within(row).getByText("4")).toBeInTheDocument();
    expect(within(row).getByText("verified")).toBeInTheDocument();

    await chooseOption("E-mail status", "Unverified");

    await waitFor(() =>
      expect(paths(calls)).toContain(
        "/bloggers?isEmailVerified=false&page=1&limit=10",
      ),
    );
  });
});

describe("Comments page", () => {
  // Lists comments with their blog, and opens the comment in place.
  it("lists comments and opens one on its blog", async () => {
    mockApi({
      "GET /comments?page=1&limit=10": {
        body: page("comments", [
          {
            reviewId: "review-1",
            blogId: "blog-1",
            blogTitle: "How Lagos learned to love the bus",
            review: "Best thing I have read all year",
            likeNo: 77,
            isEdited: true,
            createdAt: "2026-10-03T00:00:00.000Z",
            author: "user-1",
            authorDetails: ada,
          },
        ]),
      },
    });
    renderWithProviders(<CommentsPage />);

    const row = (
      await screen.findByText("Best thing I have read all year")
    ).closest("tr")!;
    expect(within(row).getByText("(edited)")).toBeInTheDocument();
    expect(
      within(row).getByRole("link", { name: "How Lagos learned to love the bus" }),
    ).toHaveAttribute("href", "/dashboard/blogs/blog-1");

    await userEvent.click(within(row).getByText("Best thing I have read all year"));

    expect(mockRouter.push).toHaveBeenCalledWith(
      "/dashboard/blogs/blog-1#review-review-1",
    );
  });
});

describe("Contact page", () => {
  // Lists contact form messages with sender, topic and message.
  it("lists contact messages", async () => {
    mockApi({
      "GET /contacts?page=1&limit=10": {
        body: page("contacts", [
          {
            contactId: "c1",
            name: "Sam Ade",
            email: "sam@example.com",
            topic: "support",
            message: "I can't reset my password",
            createdAt: "2026-10-20T00:00:00.000Z",
          },
        ]),
      },
    });
    renderWithProviders(<ContactPage />);

    const row = (await screen.findByText("Sam Ade")).closest("tr")!;
    expect(within(row).getByText("sam@example.com")).toBeInTheDocument();
    expect(within(row).getByText("support")).toBeInTheDocument();
    expect(within(row).getByText("I can't reset my password")).toBeInTheDocument();
  });
});

describe("Administrators page", () => {
  // Uses the existing admins endpoint, whose total is named totalAdmins.
  it("lists administrators with their role and status", async () => {
    mockApi({
      "GET /admins?sort=-createdAt&page=1&limit=10": {
        body: {
          admins: [
            {
              adminId: "admin-1",
              first_name: "Patty",
              last_name: "Ose",
              email: "patty@example.com",
              status: "active",
              adminRole: { name: "Super Admin" },
              createdAt: "2026-01-01T00:00:00.000Z",
            },
          ],
          pagination: { totalAdmins: 12 },
        },
      },
    });
    renderWithProviders(<AdministratorsPage />);

    const row = (await screen.findByText("Patty Ose")).closest("tr")!;
    expect(within(row).getByText("patty@example.com")).toBeInTheDocument();
    expect(within(row).getByText("Super Admin")).toBeInTheDocument();
    expect(within(row).getByText("active")).toBeInTheDocument();
    expect(screen.getByText("12 total")).toBeInTheDocument();
  });
});

describe("Roles page", () => {
  // The roles endpoint reads its search text from `search`, not `keyword`.
  it("lists roles and searches with the search parameter", async () => {
    const calls = mockApi({
      "GET /role?page=1&limit=10": {
        body: {
          roles: [
            {
              roleId: "role-1",
              name: "Editor",
              code: "EDITOR",
              status: "active",
              permissions: [{}, {}, {}],
              createdAt: "2026-02-01T00:00:00.000Z",
            },
          ],
          pagination: { totalRoles: 1 },
        },
      },
      "GET /role?search=edit&page=1&limit=10": { body: { roles: [] } },
    });
    renderWithProviders(<RolesPage />);

    const row = (await screen.findByText("Editor")).closest("tr")!;
    expect(within(row).getByText("EDITOR")).toBeInTheDocument();
    expect(within(row).getByText("3")).toBeInTheDocument();

    await userEvent.type(
      screen.getByRole("textbox", { name: "Search roles" }),
      "edit",
    );

    await waitFor(() =>
      expect(paths(calls)).toContain("/role?search=edit&page=1&limit=10"),
    );
  });
});

describe("Profile page", () => {
  const me = {
    admin: {
      adminId: "admin-1",
      first_name: "Patty",
      last_name: "Ose",
      email: "patty@example.com",
      phone_number: "08012345678",
      gender: "female",
      status: "active",
      adminRole: { name: "Super Admin" },
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  };

  const fillPasswords = async () => {
    await userEvent.type(
      screen.getByPlaceholderText("Enter your current password"),
      "Old@12345",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Enter a new password"),
      "New@12345",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Re-enter the new password"),
      "New@12345",
    );
  };

  // Shows the signed-in admin's details.
  it("shows the admin's profile", async () => {
    mockApi({ "GET /admins/me": { body: me } });
    renderWithProviders(<ProfilePage />);

    expect(
      await screen.findByRole("heading", { name: "Patty Ose" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Super Admin")).toBeInTheDocument();
    expect(screen.getByText("patty@example.com")).toBeInTheDocument();
    expect(screen.getByText("08012345678")).toBeInTheDocument();
    expect(screen.getByText("1 Jan 2026")).toBeInTheDocument();
  });

  // Sends the current and new password, confirms, and clears the form.
  it("changes the password", async () => {
    const calls = mockApi({
      "GET /admins/me": { body: me },
      "PATCH /auth/change-password": {
        body: { message: "Password changed successfully" },
      },
    });
    renderWithProviders(<ProfilePage />);
    await screen.findByRole("heading", { name: "Patty Ose" });

    await fillPasswords();
    const submit = screen.getByRole("button", { name: /update password/i });
    await waitFor(() => expect(submit).toBeEnabled());
    await userEvent.click(submit);

    expect(
      await screen.findByText("Password changed successfully"),
    ).toBeInTheDocument();
    expect(calls.find((call) => call.method === "PATCH")?.body).toEqual({
      old_password: "Old@12345",
      password: "New@12345",
    });
    await waitFor(() =>
      expect(
        screen.getByPlaceholderText("Enter your current password"),
      ).toHaveValue(""),
    );
  });

  // Shows the backend's message when the current password is wrong.
  it("shows the error for a wrong current password", async () => {
    mockApi({
      "GET /admins/me": { body: me },
      "PATCH /auth/change-password": {
        status: 400,
        body: { message: "Invalid email or password" },
      },
    });
    renderWithProviders(<ProfilePage />);
    await screen.findByRole("heading", { name: "Patty Ose" });

    await fillPasswords();
    const submit = screen.getByRole("button", { name: /update password/i });
    await waitFor(() => expect(submit).toBeEnabled());
    await userEvent.click(submit);

    expect(
      await screen.findByText("Invalid email or password"),
    ).toBeInTheDocument();
  });
});
