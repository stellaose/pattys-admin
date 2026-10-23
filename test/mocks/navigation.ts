// Stand-in for next/navigation (wired up in jest.setup.ts). Tests assert on
// these spies, e.g. expect(mockRouter.push).toHaveBeenCalledWith("/dashboard").
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

export const useRouter = () => mockRouter;

export const usePathname = jest.fn(() => "/");

export const useParams = jest.fn(() => ({}));

export const useSearchParams = jest.fn(() => new URLSearchParams());

export const redirect = jest.fn();
