import React from "react";
import { screen, within } from "@testing-library/react";
import { userEvent } from "#test/utils/user";
import { Overview } from "#components/elements";
import { mockApi } from "#test/utils/api";
import { renderWithProviders, resetStore } from "#test/utils/render";

const totals = {
  message: "Dashboard totals fetched successfully",
  totals: {
    users: 48211,
    admins: 7,
    blogs: 9734,
    reviews: 612,
    contactMessages: 15,
    visits: 1284330,
  },
};

// ? the cards only need the totals; every other dashboard request gets an empty 200
const routes = { "GET /dashboard/totals": { body: totals } };

const card = (label: string) => screen.getByRole("article", { name: label });

describe("Dashboard total cards", () => {
  beforeEach(() => {
    resetStore({ isLoggedIn: true });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Shows each all-time total, shortened when large, with the exact value on hover.
  it("shows the all-time totals", async () => {
    mockApi(routes);
    renderWithProviders(<Overview />);

    expect(
      await within(card("Total users")).findByText("48.2K"),
    ).toHaveAttribute("title", "48,211");
    expect(within(card("Total blogs")).getByText("9,734")).toBeInTheDocument();
    expect(within(card("Total visits")).getByText("1.3M")).toBeInTheDocument();
    expect(within(card("Total comments")).getByText("612")).toBeInTheDocument();
  });

  // Has no period filter, and asks for the totals without one.
  it("has no period filter", async () => {
    const calls = mockApi(routes);
    renderWithProviders(<Overview />);
    await within(card("Total users")).findByText("48.2K");

    expect(screen.queryByLabelText("Card period")).not.toBeInTheDocument();
    expect(calls.map((call) => call.path)).toContain("/dashboard/totals");
    expect(
      calls.filter((call) => call.path.startsWith("/dashboard/summary")),
    ).toHaveLength(0);
  });

  // Gives every card its own icon colour and background illustration.
  it("styles each card differently", async () => {
    mockApi(routes);
    renderWithProviders(<Overview />);
    await within(card("Total users")).findByText("48.2K");

    const labels = [
      "Total users",
      "Total blogs",
      "Total visits",
      "Total comments",
    ];
    const backgrounds = labels.map(
      (label) => card(label).className.match(/stat-card-bg-\w+/)?.[0],
    );
    const iconColours = labels.map(
      (label) =>
        card(label)
          .querySelector("svg")
          ?.parentElement?.className.match(/bg-\S+/)?.[0],
    );

    expect(new Set(backgrounds).size).toBe(4);
    expect(new Set(iconColours).size).toBe(4);
  });

  // Puts the remaining totals in the small numbers row instead of repeating the cards.
  it("lists the other totals in the numbers row", async () => {
    mockApi(routes);
    renderWithProviders(<Overview />);

    const strip = await screen.findByLabelText("All-time numbers");
    expect(await within(strip).findByText("Admins")).toBeInTheDocument();
    expect(within(strip).getByText("15")).toBeInTheDocument();
    expect(within(strip).queryByText("Users")).not.toBeInTheDocument();
  });

  // Offers a retry when the totals fail, and recovers once they load.
  it("offers a retry when the totals fail", async () => {
    mockApi({
      "GET /dashboard/totals": {
        status: 500,
        body: { message: "Server error" },
      },
    });
    renderWithProviders(<Overview />);

    expect(
      await screen.findByText("We couldn't load the totals"),
    ).toBeInTheDocument();

    jest.restoreAllMocks();
    mockApi(routes);
    const retry = within(
      screen.getByText("We couldn't load the totals")
        .parentElement as HTMLElement,
    ).getByRole("button", { name: /try again/i });
    await userEvent.click(retry);

    // ? the cards replace the error once the retry succeeds
    const users = await screen.findByRole("article", { name: "Total users" });
    expect(await within(users).findByText("48.2K")).toBeInTheDocument();
  });
});
