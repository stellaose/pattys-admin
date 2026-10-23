import "@testing-library/jest-dom";
// jsdom has no fetch; RTK Query's fetchBaseQuery needs fetch, Request and Response
import "whatwg-fetch";

jest.mock("next/navigation", () =>
  jest.requireActual("./test/mocks/navigation"),
);

// antd and framer-motion read media queries
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// jsdom does not implement getComputedStyle for pseudo-elements, which antd asks for
const getComputedStyle = window.getComputedStyle;
window.getComputedStyle = (element: Element) => getComputedStyle(element);

// jsdom has no MessageChannel; antd's components schedule work through it
if (typeof window.MessageChannel === "undefined") {
  type Port = {
    onmessage: ((event: { data: unknown }) => void) | null;
    postMessage: (data: unknown) => void;
    close: () => void;
  };

  class MessageChannelPolyfill {
    port1: Port;
    port2: Port;

    constructor() {
      const createPort = (getTarget: () => Port): Port => ({
        onmessage: null,
        postMessage: (data) =>
          setTimeout(() => getTarget().onmessage?.({ data }), 0),
        close: () => {},
      });

      this.port1 = createPort(() => this.port2);
      this.port2 = createPort(() => this.port1);
    }
  }

  Object.defineProperty(window, "MessageChannel", {
    writable: true,
    value: MessageChannelPolyfill,
  });
  Object.defineProperty(global, "MessageChannel", {
    writable: true,
    value: MessageChannelPolyfill,
  });
}

// jsdom has no ResizeObserver; antd's Select and other overlays observe their size
if (typeof window.ResizeObserver === "undefined") {
  class ResizeObserverPolyfill {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: ResizeObserverPolyfill,
  });
  Object.defineProperty(global, "ResizeObserver", {
    writable: true,
    value: ResizeObserverPolyfill,
  });
}
