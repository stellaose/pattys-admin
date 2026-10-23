import { BASE_URL } from "#/config";

type MockResponse = { status?: number; body?: unknown };

export type ApiCall = {
  method: string;
  path: string;
  body: any;
  headers: Headers;
};

// Replaces fetch with canned backend responses keyed by "METHOD /path",
// e.g. { "POST /auth/login": { status: 200, body: { ... } } }.
// Returns the list of requests the app made so tests can assert on them.
export const mockApi = (routes: Record<string, MockResponse>) => {
  const calls: ApiCall[] = [];

  jest
    .spyOn(global, "fetch")
    .mockImplementation(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const request = new Request(input, init);
        const requestUrl = new URL(request.url);
        const basePath = BASE_URL
          ? new URL(BASE_URL).pathname.replace(/\/$/, "")
          : "";
        const pathName =
          basePath &&
          (requestUrl.pathname === basePath ||
            requestUrl.pathname.startsWith(`${basePath}/`))
            ? requestUrl.pathname.slice(basePath.length) || "/"
            : requestUrl.pathname;
        const path = `${pathName}${requestUrl.search}`;
        const text = await request.clone().text();

        calls.push({
          method: request.method,
          path,
          body: text ? JSON.parse(text) : undefined,
          headers: request.headers,
        });

        const route = routes[`${request.method} ${path}`];

        if (!route) {
          return new Response(
            JSON.stringify({
              message: `No mock for ${request.method} ${path}`,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }

        return new Response(JSON.stringify(route.body ?? {}), {
          status: route.status ?? 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    );

  return calls;
};
