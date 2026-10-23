import React from "react";
import { screen, waitFor } from "@testing-library/react";
import BlogDetails from "#/app/dashboard/blogs/[blogId]/page";
import { useParams } from "#test/mocks/navigation";
import { mockApi } from "#test/utils/api";
import { renderWithProviders, resetStore } from "#test/utils/render";

const blog = {
  blogId: "blog-1",
  title: "How Lagos learned to love the bus",
  category: "news",
  description: ["First paragraph.", "Second paragraph."],
  likeNo: 1204,
  dislikeNo: 12,
  isFlagged: true,
  createdAt: "2026-10-01T09:00:00.000Z",
  updatedAt: "2026-10-01T09:00:00.000Z",
  author: "user-1",
  authorDetails: { userId: "user-1", first_name: "Ada", last_name: "Lovelace" },
  review: [
    {
      reviewId: "review-1",
      review: "Best thing I have read all year",
      likeNo: 77,
      isEdited: true,
      author: "user-2",
      authorDetails: { userId: "user-2", user_name: "grace" },
    },
  ],
};

describe("Blog details page", () => {
  beforeEach(() => {
    resetStore({ isLoggedIn: true });
    jest.clearAllMocks();
    useParams.mockReturnValue({ blogId: "blog-1" });
    window.location.hash = "";
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Shows the blog, its author and stats, its body and every comment.
  it("shows the blog with its reviews", async () => {
    mockApi({ "GET /blogs/blog-1": { body: { blog } } });
    renderWithProviders(<BlogDetails />);

    expect(
      await screen.findByRole("heading", {
        level: 2,
        name: "How Lagos learned to love the bus",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Flagged")).toBeInTheDocument();
    expect(screen.getByText("news")).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("1 Oct 2026")).toBeInTheDocument();
    expect(screen.getByText("1,204")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Comments (1)")).toBeInTheDocument();
    expect(
      screen.getByText("Best thing I have read all year"),
    ).toBeInTheDocument();
    expect(screen.getByText("@grace")).toBeInTheDocument();
    expect(screen.getByText("edited")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to overview/i }),
    ).toHaveAttribute("href", "/dashboard");
  });

  // A review opened from the dashboard is scrolled to and highlighted.
  it("highlights the review linked from the dashboard", async () => {
    window.location.hash = "#review-review-1";
    mockApi({ "GET /blogs/blog-1": { body: { blog } } });
    renderWithProviders(<BlogDetails />);

    await screen.findByText("Best thing I have read all year");

    const item = document.getElementById("review-review-1") as HTMLElement;
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    await waitFor(() => expect(item).toHaveClass("bg-lilac-100"));
  });

  // A deleted blog gets a clear message instead of an error.
  it("explains when the blog no longer exists", async () => {
    mockApi({
      "GET /blogs/blog-1": { status: 404, body: { message: "Blog not found" } },
    });
    renderWithProviders(<BlogDetails />);

    expect(
      await screen.findByText("This blog no longer exists"),
    ).toBeInTheDocument();
  });

  // Other failures offer a retry.
  it("offers a retry when loading fails", async () => {
    mockApi({
      "GET /blogs/blog-1": { status: 500, body: { message: "Server error" } },
    });
    renderWithProviders(<BlogDetails />);

    expect(
      await screen.findByText("We couldn't load this blog"),
    ).toBeInTheDocument();
  });
});
